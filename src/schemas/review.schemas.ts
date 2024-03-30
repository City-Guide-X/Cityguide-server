import { Rating } from '@types';
import { nativeEnum, object, optional, string, TypeOf } from 'zod';

export const createReviewSchema = object({
  body: object({
    establishment: string({ required_error: 'Establishment id is required' }),
    rating: nativeEnum(Rating, {
      required_error: 'Rating is required',
      invalid_type_error: 'Rating should be a number [1-5]',
    }),
    message: string({ required_error: 'Message is required' }).min(3, 'Message requires atleast 3 characters'),
  }),
});

export const getReviewSchema = object({
  body: object({
    establishment: optional(string({ required_error: 'Establishment id is required' })),
  }),
});

export const deleteReviewSchema = object({
  params: object({
    reviewId: string({ required_error: 'Review id is required' }),
  }),
});

export type createReviewInput = TypeOf<typeof createReviewSchema>['body'];
export type getReviewInput = TypeOf<typeof getReviewSchema>['body'];
export type deleteReviewInput = TypeOf<typeof deleteReviewSchema>['params'];
