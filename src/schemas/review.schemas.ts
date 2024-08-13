import { PropertyType, Rating } from '@types';
import { nativeEnum, object, optional, string, TypeOf } from 'zod';

export const createReviewSchema = object({
  body: object({
    property: string({ required_error: 'Property id is required' }),
    propertyType: nativeEnum(PropertyType, {
      required_error: 'Property type is required',
      invalid_type_error: 'Property type should be a Stay | Restaurant | NightLife',
    }),
    rating: nativeEnum(Rating, {
      required_error: 'Rating is required',
      invalid_type_error: 'Rating should be a 0 | 1 | 2 | 3 | 4 | 5',
    }),
    message: string({ required_error: 'Message is required' }).min(10, 'Message requires atleast 10 characters'),
  }),
});

export const getPropertyReviewSchema = object({
  params: object({
    propertyId: string({ required_error: 'Establishment id is required' }),
  }),
});

export const deleteReviewSchema = object({
  params: object({
    reviewId: string({ required_error: 'Review id is required' }),
  }),
});

export type createReviewInput = TypeOf<typeof createReviewSchema>['body'];
export type getPropertyReviewInput = TypeOf<typeof getPropertyReviewSchema>['params'];
export type deleteReviewInput = TypeOf<typeof deleteReviewSchema>['params'];
