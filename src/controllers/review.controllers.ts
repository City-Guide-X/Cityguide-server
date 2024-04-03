import { privateFields } from '@models';
import { createReviewInput, deleteReviewInput, getReviewInput } from '@schemas';
import { createReview, deleteReview, getEstablishmentReviews, updateEstablishmentRating } from '@services';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createReviewHandler = async (req: Request<{}, {}, createReviewInput>, res: Response) => {
  const { establishment, ...data } = req.body;
  const { id } = res.locals.user;
  try {
    const review = await createReview(data, id, establishment);
    await updateEstablishmentRating(establishment);
    return res.status(201).json({ review: omit(review.toJSON(), privateFields) });
  } catch (err: any) {
    if (err?.errors?.establishment) return res.status(400).json({ message: 'Invalid Establishment ID' });
  }
};

export const getEstablishmentReviewsHandler = async (req: Request<{}, {}, getReviewInput>, res: Response) => {
  let { establishment } = req.body;
  const { id, type } = res.locals.user;
  if (type === 'ESTABLISHMENT') establishment = id;
  if (type === 'USER' && !establishment) return res.status(400).json({ message: 'Establishment ID is required' });
  const reviews = await getEstablishmentReviews(establishment!);
  if (!reviews.length) return res.status(404).json({ message: 'No reviews found' });
  return res.status(200).json({ reviews });
};

export const deleteReviewHandler = async (req: Request<deleteReviewInput>, res: Response) => {
  const { id } = res.locals.user;
  const { reviewId } = req.params;
  const isDeleted = await deleteReview(reviewId, id);
  if (!isDeleted) return res.status(400).json({ message: 'Operation failed' });
  await updateEstablishmentRating(isDeleted.establishment.toString());
  return res.sendStatus(204);
};
