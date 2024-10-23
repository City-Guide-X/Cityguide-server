import { PlaceData } from '@googlemaps/google-maps-services-js';
import { privateFields, privateUserFields } from '@models';
import { omit } from 'lodash';

interface IRetryConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  shouldRetry?: (error: any) => boolean;
}

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
