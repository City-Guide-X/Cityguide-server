import { BadRequestError } from '@errors';
import { privateFields } from '@models';
import { createReviewInput, deleteReviewInput } from '@schemas';
import { createReview, deleteReview, updateEstablishmentRating } from '@services';
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createReviewHandler = asyncWrapper(async (req: Request<{}, {}, createReviewInput>, res: Response) => {
  const { establishment, ...data } = req.body;
  const { id } = res.locals.user;
  const review = await createReview(data, id, establishment);
  await updateEstablishmentRating(establishment);
  return res.status(201).json({ review: omit(review.toJSON(), privateFields) });
});

export const deleteReviewHandler = asyncWrapper(async (req: Request<deleteReviewInput>, res: Response) => {
  const { id } = res.locals.user;
  const { reviewId } = req.params;
  const isDeleted = await deleteReview(reviewId, id);
  if (!isDeleted) throw new BadRequestError();
  await updateEstablishmentRating(isDeleted.establishment.toString());
  return res.sendStatus(204);
});
