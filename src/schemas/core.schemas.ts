import { object, string, TypeOf } from 'zod';

export const verifyEmailSchema = object({
  params: object({
    otp: string(),
  }),
});

export type verifyEmailInput = TypeOf<typeof verifyEmailSchema>['params'];
