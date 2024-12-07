import { categoryMap } from '@constants';
import { PropertyType, Rating, Reviewer } from '@types';
import { nativeEnum, object, string, TypeOf, ZodIssueCode } from 'zod';

export const createReviewSchema = object({
  body: object({
    property: string({ required_error: 'Property id is required' }),
    propertyType: nativeEnum(PropertyType, {
      required_error: 'Property type is required',
      invalid_type_error: 'Property type should be a Stay | Restaurant | NightLife',
    }),
    categoryRatings: object({}, { required_error: 'Category rating is required' }).catchall(nativeEnum(Rating)),
    message: string({ required_error: 'Message is required' }).min(3, 'Message should be at least 3 characters'),
    reservationId: string().optional(),
    reviewer: nativeEnum(Reviewer, {
      required_error: 'Reviewer is required',
      invalid_type_error: 'Reviewer should be a Family | Couple | Solo traveler | Business traveler | Group of friends',
    }),
  }).superRefine((data, ctx) => {
    const requiredCategories = categoryMap[data.propertyType];
    const providedCategories = Object.keys(data.categoryRatings);
    const [provided, required] = [new Set(providedCategories), new Set(requiredCategories)];
    const invalidCategories = providedCategories.filter((category) => !required.has(category));
    const missingCategories = requiredCategories.filter((category) => !provided.has(category));
    if (invalidCategories.length > 0 || providedCategories.length !== requiredCategories.length) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: `Invalid categories provided ${invalidCategories.join(
          ', '
        )}. Missing categories are ${missingCategories.join(', ')}`,
        path: ['categoryRatings'],
      });
    }
    if (data.propertyType === PropertyType.STAY && !data.reservationId) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'Reservation id is required for Stay property',
        path: ['reservationId', 'propertyType'],
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

export const canReviewSchema = object({
  query: object({
    propertyId: string({ required_error: 'Property id is required' }),
    propertyType: nativeEnum(PropertyType, {
      required_error: 'Property type is required',
      invalid_type_error: 'Property type should be a Stay | Restaurant | NightLife',
    }),
  }),
});

export type createReviewInput = TypeOf<typeof createReviewSchema>['body'];
export type getPropertyReviewInput = TypeOf<typeof getPropertyReviewSchema>['params'];
export type deleteReviewInput = TypeOf<typeof deleteReviewSchema>['params'];
export type canReviewInput = TypeOf<typeof canReviewSchema>['query'];
