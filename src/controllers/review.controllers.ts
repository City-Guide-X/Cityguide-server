import { BadRequestError, NotFoundError } from '@errors';
import { privateFields } from '@models';
import { createReviewInput, deleteReviewInput, getReviewInput } from '@schemas';
import { createReview, deleteReview, getEstablishmentReviews, updateEstablishmentRating } from '@services';
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
export const getEstablishmentReviewsHandler = asyncWrapper(
  async (req: Request<{}, {}, getReviewInput>, res: Response) => {
    let { establishment } = req.body;
    const { id, type } = res.locals.user;
    if (type === 'ESTABLISHMENT') establishment = id;
    if (type === 'USER' && !establishment) throw new BadRequestError('Establishment ID is required');
    const reviews = await getEstablishmentReviews(establishment!);
    if (!reviews.length) throw new NotFoundError('No reviews found');
    return res.status(200).json({ reviews });
  }
);

export const deleteReviewHandler = asyncWrapper(async (req: Request<deleteReviewInput>, res: Response) => {
  const { id } = res.locals.user;
  const { reviewId } = req.params;
  const isDeleted = await deleteReview(reviewId, id);
  if (!isDeleted) throw new BadRequestError();
  await updateEstablishmentRating(isDeleted.establishment.toString());
  return res.sendStatus(204);
});
