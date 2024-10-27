import { PlaceData } from '@googlemaps/google-maps-services-js';
import { privateFields, privateUserFields } from '@models';
import { omit } from 'lodash';

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
type SanitizedData = Record<string, any> | Array<Record<string, any>>;

export const formatNearbyLocations = (res: Partial<PlaceData>) => ({
  name: res.name,
  geoLocation: res.geometry?.location,
  types: res.types,
});

export const sanitizeEngagement = (engagement: any) => ({
  ...omit(engagement, privateFields),
  user: engagement.user[0] ? omit(engagement.user[0], privateUserFields) : null,
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

export const sanitize = (data: SanitizedData, fields: string[], inners?: ISanitizeInner[]): SanitizedData => {
  if (!data) return data;
  if (!fields.length && !inners?.length) return data;
  if (Array.isArray(data)) return data.map((item) => sanitize(item, fields, inners));
  const fieldSet = new Set(fields);
  const result: Record<string, any> = {};
  Object.keys(data).forEach((key) => {
    if (!fieldSet.has(key)) result[key] = data[key];
  });
  if (inners?.length) {
    for (const { field, fields } of inners) {
      if (data[field]) result[field] = sanitize(data[field], fields);
    }
  }
  return result;
};
