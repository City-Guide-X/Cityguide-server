import { boolean, coerce, number, object, string, TypeOf, z, ZodIssueCode } from 'zod';

export const initiatePaymentSchema = object({
  body: object({
    amount: number({ invalid_type_error: 'Amount should be a number' }).optional(),
    currency: string()
      .regex(/^[A-Z]{3}$/, 'Invalid currency')
      .optional(),
    useSavedCard: boolean({ invalid_type_error: 'useSavedCard should be true or false' }).optional().default(false),
  }).refine((data) => !!data.amount === !!data.currency, { message: 'Currency is required when amount is provided' }),
});

export const completePaymentSchema = object({
  body: object({
    pin: string().optional(),
    otp: string().optional(),
    phone: string().min(11, 'Phone should be atleast 11 characters long').optional(),
    birthday: coerce.date({ invalid_type_error: 'Birthday should be a date' }).optional(),
    reference: string({ required_error: 'Reference is required' }),
  }).superRefine((data, ctx) => {
    const optionalFields: Array<keyof typeof data> = ['pin', 'otp', 'phone', 'birthday'];
    const providedFields = optionalFields.filter((field) => data[field] !== undefined);
    if (providedFields.length !== 1) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'Exactly one of pin, otp, phone, or birthday must be provided',
        path: optionalFields,
      });
    }
  }),
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
export type completePaymentInput = TypeOf<typeof completePaymentSchema>['body'];
