import { object, optional, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    firstName: string({ required_error: 'First name is required' }),
    lastName: string({ required_error: 'Last name is required' }),
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

export type createUserInput = TypeOf<typeof createUserSchema>['body'];
export type loginUserInput = TypeOf<typeof loginUserSchema>['body'];
