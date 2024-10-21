import { number, object, string, TypeOf } from 'zod';

export const initiatePaymentSchema = object({
  body: object({
    amount: number({ invalid_type_error: 'Amount should be a number' }).optional(),
  }),
});

export const exchangeRateSchema = object({
  query: object({
    base: string({ required_error: 'Base currency is required' }).regex(/^[A-Z]{3}$/, 'Invalid base currency'),
    currency: string({ required_error: 'Currency is required' }).regex(/^[A-Z]{3}$/, 'Invalid currency'),
    amount: string()
      .regex(/^\d+(\.\d{2})?$/, 'Invalid amount')
      .optional()
      .transform((val) => val && parseFloat(val)),
  }),
});

export type initiatePaymentInput = TypeOf<typeof initiatePaymentSchema>['body'];
export type exchangeRateInput = TypeOf<typeof exchangeRateSchema>['query'];
