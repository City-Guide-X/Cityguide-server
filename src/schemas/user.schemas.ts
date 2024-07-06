import { coerce, object, strictObject, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    firstName: string({ required_error: 'First name is required' }).min(3, 'First name requires atleast 3 characters'),
    lastName: string({ required_error: 'Last name is required' }).min(3, 'Last name requires atleast 3 characters'),
    phoneNumber: string().min(11, 'Invalid phone number').optional(),
    dateOfBirth: coerce.date({ required_error: 'Date of birth is required' }).optional(),
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
  body: strictObject({
    firstName: string().min(3, 'First name requires atleast 3 characters').optional(),
    lastName: string().min(3, 'Last name requires atleast 3 characters').optional(),
    dateOfBirth: coerce.date().optional(),
    phoneNumber: string().min(11, 'Invalid phone number').optional(),
    imgUrl: string().optional(),
  }),
});

export const upgradeUserToPartnerSchema = object({
  body: object({
    dateOfBirth: coerce.date({ required_error: 'Date of birth is required' }),
    phoneNumber: string({ required_error: 'Phone number is required' }).min(11, 'Invalid phone number'),
  }),
});

export type createUserInput = TypeOf<typeof createUserSchema>['body'];
export type loginUserInput = TypeOf<typeof loginUserSchema>['body'];
export type updateUserInput = TypeOf<typeof updateUserSchema>['body'];
export type upgradeUserToPartnerInput = TypeOf<typeof upgradeUserToPartnerSchema>['body'];
