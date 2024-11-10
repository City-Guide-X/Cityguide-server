import { number, object, string, TypeOf, z, ZodIssueCode } from 'zod';

export const initiatePaymentSchema = object({
  body: object({
    amount: number({ invalid_type_error: 'Amount should be a number' }).optional(),
    currency: string()
      .regex(/^[A-Z]{3}$/, 'Invalid currency')
      .optional(),
  }).refine((data) => !!data.amount === !!data.currency, { message: 'Currency is required when amount is provided' }),
});

export const exchangeRateSchema = object({
  query: object({
    base: string({ required_error: 'Base currency is required' }).regex(/^[A-Z]{3}$/, 'Invalid base currency'),
    currency: string()
      .regex(/^[A-Z]{3}$/, 'Invalid currency')
      .optional(),
    amount: string()
      .regex(/^\d+(\.\d{2})?$/, 'Invalid amount')
      .optional()
      .transform((val) => val && parseFloat(val)),
  }).superRefine((data, ctx) => {
    if (data.amount && !data.currency) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'Currency is required when amount is provided',
        path: ['currency', 'amount'],
      });
    }
  }),
});

export const getBanksSchema = object({
  query: object({
    country: z.enum(['ghana', 'kenya', 'nigeria', 'south africa'], { required_error: 'Country is required' }),
  }),
});

export type getBanksInput = TypeOf<typeof getBanksSchema>['query'];
export type exchangeRateInput = TypeOf<typeof exchangeRateSchema>['query'];
export type initiatePaymentInput = TypeOf<typeof initiatePaymentSchema>['body'];
