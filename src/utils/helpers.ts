import { PlaceData } from '@googlemaps/google-maps-services-js';
import { privateFields, privateUserFields } from '@models';

interface IRetryConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  shouldRetry?: (error: any) => boolean;
}
interface ISanitizeInner {
  field: string;
  fields: string[];
}
type SanitizedOutput<T> = T extends Array<any> ? Array<Partial<T[number]>> : Partial<T>;

export const formatNearbyLocations = (res: Partial<PlaceData>) => ({
  name: res.name,
  geoLocation: res.geometry?.location,
  types: res.types,
});

export const sanitizeEngagement = (engagement: any) => ({
  ...sanitize(engagement, privateFields),
  user: engagement.user[0] ? sanitize(engagement.user[0], privateUserFields) : null,
});

export const withRetry = async <T>(fn: () => Promise<T>, config: IRetryConfig = {}) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    shouldRetry = (error: any) => error.response?.status >= 500,
  } = config;
  let lastError: any;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      if (i === maxRetries || !shouldRetry(err)) throw err;
      const delay = Math.min(baseDelay * Math.pow(2, i) + Math.random() * baseDelay, maxDelay);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

export const sanitize = <T>(data: T | T[], fields: string[], inners?: ISanitizeInner[]): SanitizedOutput<T> => {
  if (!data) return data as SanitizedOutput<T>;
  if (!fields.length && !inners?.length) return data as SanitizedOutput<T>;
  if (Array.isArray(data)) {
    return data.map((item) => sanitize(item, fields, inners)) as unknown as SanitizedOutput<T>;
  }
  let dataset: T & { toJSON?: Function } = data;
  if (typeof dataset.toJSON === 'function') dataset = dataset.toJSON();
  const fieldSet = new Set(fields);
  const result: Partial<T> = {};
  Object.keys(dataset).forEach((key) => {
    if (!fieldSet.has(key)) result[key as keyof T] = (dataset as Record<string, any>)[key];
  });
  if (inners?.length) {
    for (const { field, fields } of inners) {
      if (dataset[field as keyof T])
        (result as Record<string, any>)[field] = sanitize((dataset as Record<string, any>)[field], fields);
    }
  }
  return result as SanitizedOutput<T>;
};

export const numberFormat = (number: number) => {
  number = number || 0;
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const numberToCurrency = (value: number) => {
  const number = (+value || 0).toFixed(2);
  const [currency, decimal] = number.split('.');
  return `${numberFormat(+currency)}.${decimal}`;
};
