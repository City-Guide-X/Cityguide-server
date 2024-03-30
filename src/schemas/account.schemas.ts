import { object, string, TypeOf } from 'zod';

export const verifyEmailSchema = object({
  params: object({
    otp: string(),
  }),
});

export const changePasswordSchema = object({
  body: object({
    password: string({ required_error: 'New password is required' }).min(8, 'Password should be atleast 8 characters'),
  }),
  params: object({
    otp: string(),
  }),
});

export type verifyEmailInput = TypeOf<typeof verifyEmailSchema>['params'];
export type changePasswordInput = TypeOf<typeof changePasswordSchema>;
