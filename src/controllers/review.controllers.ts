import { BadRequestError } from '@errors';
import { privateFields } from '@models';
import { createReviewInput, deleteReviewInput, getPropertyReviewInput } from '@schemas';
import { createReview, deleteReview, getReviews, isPropertyType } from '@services';
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createReviewHandler = asyncWrapper(async (req: Request<{}, {}, createReviewInput>, res: Response) => {
  const { id } = res.locals.user;
  const { property, ...body } = req.body;
  const data = { ...body, property: property as any, user: id };
  const isValid = await isPropertyType(property, data.propertyType);
  if (!isValid) throw new BadRequestError(`Invalid ${data.propertyType} ID`);
  const review = await createReview(data);
  return res.status(201).json({ review: omit(review.toJSON(), privateFields) });
});

export const getPropertyReviewsHandler = asyncWrapper(async (req: Request<getPropertyReviewInput>, res: Response) => {
  const { propertyId } = req.params;
  const reviews = await getReviews(propertyId);
  return res.status(200).json({ reviews: reviews.map((review) => omit(review.toJSON(), privateFields)) });
});

export const deleteReviewHandler = asyncWrapper(async (req: Request<deleteReviewInput>, res: Response) => {
  const { id } = res.locals.user;
  const { reviewId } = req.params;
  const { matchedCount, modifiedCount } = await deleteReview(reviewId, id);
  if (!matchedCount || !modifiedCount) throw new BadRequestError();
  return res.sendStatus(204);
});
