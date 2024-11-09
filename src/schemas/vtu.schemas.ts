import { ISPs } from '@types';
import { nativeEnum, object, string, TypeOf } from 'zod';

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
  body: object({
    firstName: string().min(1, 'First name should be atleast 1 character').optional(),
    lastName: string().min(1, 'Last name should be atleast 1 character').optional(),
    phoneNumber: string().min(11, 'Phone number should be atleast 11 characters').optional(),
    network: nativeEnum(ISPs, { invalid_type_error: 'Invalid network' }).optional(),
  }),
  params: object({
    receiverId: string({ required_error: 'Receiver id is required' }),
  }),
});

export const deleteReceiverSchema = object({
  params: object({
    receiverId: string({ required_error: 'Receiver id is required' }),
  }),
});

export type createReceiverInput = TypeOf<typeof createReceiverSchema>['body'];
export type updateReceiverInput = TypeOf<typeof updateReceiverSchema>;
export type deleteReceiverInput = TypeOf<typeof deleteReceiverSchema>['params'];
