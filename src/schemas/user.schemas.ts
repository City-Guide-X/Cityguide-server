import { PropertyType } from '@types';
import { date, nativeEnum, object, optional, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    firstName: string({ required_error: 'First name is required' }).min(3, 'First name requires atleast 3 characters'),
    lastName: string({ required_error: 'Last name is required' }).min(3, 'Last name requires atleast 3 characters'),
    phoneNumber: optional(string().min(11, 'Invalid phone number')),
    email: string({ required_error: 'Email is required' }).email('Invalid email'),
    password: string({ required_error: 'Password is required' }).min(8, 'Password should be atleast 8 characters'),
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email('Invalid email'),
    password: string({ required_error: 'Password is required' }).min(8, 'Password should be atleast 8 characters'),
  }),
});

export const updateUserSchema = object({
  body: object({
    firstName: optional(string().min(3, 'First name requires atleast 3 characters')),
    lastName: optional(string().min(3, 'Last name requires atleast 3 characters')),
    dateOfBirth: optional(date()),
    phoneNumber: optional(string().min(11, 'Invalid phone number')),
    imgUrl: optional(string()),
  }),
});

export const getEstablishmentSchema = object({
  params: object({
    id: string({ required_error: 'Establishment ID is required' }),
  }),
});

export const getEstablishmentsSchema = object({
  body: object({
    types: optional(nativeEnum(PropertyType, { required_error: 'Establishment types required' }).array()),
  }),
});

export type createUserInput = TypeOf<typeof createUserSchema>['body'];
export type loginUserInput = TypeOf<typeof loginUserSchema>['body'];
export type updateUserInput = TypeOf<typeof updateUserSchema>['body'];
export type getEstablishmentInput = TypeOf<typeof getEstablishmentSchema>['params'];
export type getEstablishmentsInput = TypeOf<typeof getEstablishmentsSchema>['body'];
