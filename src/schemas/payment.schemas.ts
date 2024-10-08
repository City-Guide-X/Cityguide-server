import { number, object, string, TypeOf } from 'zod';

export const initiatePaymentSchema = object({
  body: object({
    amount: number({ required_error: 'Amount is required', invalid_type_error: 'Amount should be a number' }),
    currency: string({ required_error: 'Currency is required' }).regex(
      /^NGN|USD|GHS|ZAR|KES$/,
      'Currency should be a valid currency code'
    ),
  }),
});

export type initiatePaymentInput = TypeOf<typeof initiatePaymentSchema>['body'];
