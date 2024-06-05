import { BadRequestError } from '@errors';
import { privateFields } from '@models';
import { createReviewInput, deleteReviewInput } from '@schemas';
import { deleteReview, isPropertyType, reviewNightLife, reviewRestaurant, reviewStay } from '@services';
import { PropertyType } from '@types';
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createReviewHandler = asyncWrapper(async (req: Request<{}, {}, createReviewInput>, res: Response) => {
  const { id } = res.locals.user;
  const { property, ...body } = req.body;
  const data = { ...body, property: property as any, user: id };
  const isValid = await isPropertyType(property, data.propertyType);
  if (!isValid) throw new BadRequestError(`Invalid ${data.propertyType} ID`);
  const review =
    data.propertyType === PropertyType.STAY
      ? await reviewStay(data)
      : data.propertyType === PropertyType.RESTAURANT
      ? await reviewRestaurant(data)
      : await reviewNightLife(data);
  return res.status(201).json({ review: omit(review, privateFields) });
});

export const deleteReviewHandler = asyncWrapper(async (req: Request<deleteReviewInput>, res: Response) => {
  const { id } = res.locals.user;
  const { reviewId } = req.params;
  const isDeleted = await deleteReview(reviewId, id);
  if (!isDeleted) throw new BadRequestError();
  return res.sendStatus(204);
});
