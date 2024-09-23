import { categoryMap } from '@constants';
import { PropertyType, Rating } from '@types';
import { nativeEnum, object, string, TypeOf, ZodIssueCode } from 'zod';

export const createReviewSchema = object({
  body: object({
    property: string({ required_error: 'Property id is required' }),
    propertyType: nativeEnum(PropertyType, {
      required_error: 'Property type is required',
      invalid_type_error: 'Property type should be a Stay | Restaurant | NightLife',
    }),
    categoryRatings: object({}, { required_error: 'Category rating is required' }).catchall(nativeEnum(Rating)),
    message: string({ required_error: 'Message is required' }).min(10, 'Message requires atleast 10 characters'),
  }).superRefine((data, ctx) => {
    const requiredCategories = categoryMap[data.propertyType];
    const providedCategories = new Set(Object.keys(data.categoryRatings));
    const invalidCategories = requiredCategories.filter((category) => !providedCategories.has(category));
    if (invalidCategories.length > 0 || providedCategories.size !== requiredCategories.length) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: `Invalid categories provided. Missing categories are ${invalidCategories.join(', ')}`,
        path: ['categoryRatings'],
      });
    }
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
