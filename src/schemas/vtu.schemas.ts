import { number, object, string, TypeOf } from 'zod';

export const getPlanSchema = object({
  params: object({
    provider: string().regex(/^(AIRTEL|MTN|GLO|ETISALAT)$/, 'Provider Invalid'),
  }),
});

export const getAirtimeSchema = object({
  body: object({
    provider: string({ required_error: 'Service provider is required' }).regex(
      /^(AIRTEL|MTN|GLO|ETISALAT)$/,
      'Service provider not valid'
    ),
    phoneNumber: string({ required_error: 'Top-up number is require' }).min(11, 'Invalid phone number'),
    amount: number({
      required_error: 'Top-up amount required',
      invalid_type_error: 'Top-up amount should be a number',
    }),
  }),
});

export const getDataSchema = object({
  body: object({
    paymentCode: string({ required_error: 'Payment Code is required' }),
    phoneNumber: string({ required_error: 'Top-up number is require' }).min(11, 'Invalid phone number'),
    amount: number({
      required_error: 'Top-up amount required',
      invalid_type_error: 'Top-up amount should be a number',
    }),
  }),
});

export type getPlansInput = TypeOf<typeof getPlanSchema>['params'];
export type getAirtimeInput = TypeOf<typeof getAirtimeSchema>['body'];
export type getDataInput = TypeOf<typeof getDataSchema>['body'];
