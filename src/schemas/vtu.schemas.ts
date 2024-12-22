import { ISPs, VTUType } from '@types';
import { boolean, nativeEnum, number, object, string, TypeOf } from 'zod';

export const createReceiverSchema = object({
  body: object({
    firstName: string({ required_error: 'First name is required' }).min(1, 'First name should be atleast 1 character'),
    lastName: string({ required_error: 'Last name is required' }).min(1, 'Last name should be atleast 1 character'),
    phoneNumber: string({ required_error: 'Phone number is required' }).min(
      11,
      'Phone number should be atleast 11 characters'
    ),
    network: nativeEnum(ISPs, {
      required_error: 'Network is required',
      invalid_type_error: 'Invalid network',
    }),
  }),
});

export const updateReceiverSchema = object({
  body: createReceiverSchema.shape.body,
  params: object({
    receiverId: string({ required_error: 'Receiver id is required' }),
  }),
});

export const deleteReceiverSchema = object({
  params: object({
    receiverId: string({ required_error: 'Receiver id is required' }),
  }),
});

export const createTransactionSchema = object({
  body: object({
    firstName: string({ required_error: 'First name is required' }).min(1, 'First name should be atleast 1 character'),
    lastName: string({ required_error: 'Last name is required' }).min(1, 'Last name should be atleast 1 character'),
    phoneNumber: string({ required_error: 'Phone number is required' }).min(
      11,
      'Phone number should be atleast 11 characters'
    ),
    network: nativeEnum(ISPs, {
      required_error: 'Network is required',
      invalid_type_error: 'Invalid network',
    }),
    serviceId: string({ required_error: 'Service id is required' }),
    amount: number({ required_error: 'Amount is required', invalid_type_error: 'Amount should be a number' }).min(1),
    value: string({ required_error: 'Service value is required' }),
    type: nativeEnum(VTUType, {
      required_error: 'Transaction type is required',
      invalid_type_error: 'Invalid transaction type',
    }),
    payReference: string({ required_error: 'Pay reference is required' }),
    useSavedCard: boolean({ invalid_type_error: 'Save card should be true or false' }).optional().default(false),
    saveCard: boolean({ invalid_type_error: 'Save card should be true or false' }).optional().default(true),
  }),
});

export const getVTUTransactionSchema = object({
  params: object({
    transactionId: string({ required_error: 'Transaction id is required' }),
  }),
});

export const vtuServicesSchema = object({
  query: object({
    type: nativeEnum(VTUType, {
      required_error: 'VTU type is required',
      invalid_type_error: 'Invalid VTU type',
    }),
    isp: nativeEnum(ISPs, {
      required_error: 'ISP is required',
      invalid_type_error: 'Invalid ISP',
    }),
  }),
});

export type createReceiverInput = TypeOf<typeof createReceiverSchema>['body'];
export type updateReceiverInput = TypeOf<typeof updateReceiverSchema>;
export type deleteReceiverInput = TypeOf<typeof deleteReceiverSchema>['params'];
export type createTransactionInput = TypeOf<typeof createTransactionSchema>['body'];
export type vtuServicesInput = TypeOf<typeof vtuServicesSchema>['query'];
export type getVTUTransactionInput = TypeOf<typeof getVTUTransactionSchema>['params'];
