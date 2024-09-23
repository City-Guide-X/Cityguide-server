import { BadRequestError, NotFoundError } from '@errors';
import { privateFields } from '@models';
import { createReviewInput, deleteReviewInput, getPropertyReviewInput } from '@schemas';
import { canReview, createNotification, createReview, deleteReview, getReviews } from '@services';
import { EntityType, NotificationType } from '@types';
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createReviewHandler = asyncWrapper(async (req: Request<{}, {}, createReviewInput>, res: Response) => {
  const { id } = res.locals.user;
  const { property, ...body } = req.body;
  const data = { ...body, property, user: id };
  const isValid = await canReview(property, data.propertyType, id);
  if (!isValid) throw new BadRequestError('You cannot review this property');
  const review = await createReview(data);
  const reviewResponse = omit(review.toJSON(), privateFields);
  res.status(201).json({ review: reviewResponse });
  const populatedReview: any = await review.populate({ path: 'property', select: 'name type -_id' });
  const notification = {
    recipient: populatedReview.property.partner.id,
    recipientType: EntityType.ESTABLISHMENT,
    type: NotificationType.REVIEW,
    title: 'New Review',
    message: `Your ${populatedReview.property.type ?? 'Restaurant'} — ${
      populatedReview.property.name
    } has recieved a new review! Check out what your guest has to say. Visit your dashboard for more details`,
  };
  const newNotification = await createNotification(notification);
  const socketId = onlineUsers.get(populatedReview.property.partner.id);
  if (socketId) res.locals.io?.to(socketId).emit('new_notification', newNotification);
  res.locals.io?.emit('new_review', { property, type: body.propertyType, review: reviewResponse });
});

export const getPropertyReviewsHandler = asyncWrapper(async (req: Request<getPropertyReviewInput>, res: Response) => {
  const { propertyId } = req.params;
  const reviews = await getReviews(propertyId);
  return res.status(200).json({ reviews: reviews.map((review) => omit(review.toJSON(), privateFields)) });
});

export const deleteReviewHandler = asyncWrapper(async (req: Request<deleteReviewInput>, res: Response) => {
  const { id } = res.locals.user;
  const { reviewId } = req.params;
  const review = await deleteReview(reviewId, id);
  if (!review) throw new NotFoundError('Review not found');
  res.sendStatus(204);
  const populatedReview: any = await review.populate({ path: 'property', select: 'name type -_id' });
  const notification = {
    recipient: populatedReview.property.partner.id,
    recipientType: EntityType.ESTABLISHMENT,
    type: NotificationType.REVIEW,
    title: 'New Review',
    message: `Your ${populatedReview.property.type ?? 'Restaurant'} — ${
      populatedReview.property.name
    } has recieved a new review! Check out what your guest has to say. Visit your dashboard for more details`,
  };
  const newNotification = await createNotification(notification);
  const socketId = onlineUsers.get(populatedReview.property.partner.id);
  if (socketId) res.locals.io?.to(socketId).emit('new_notification', newNotification);
  res.locals.io?.emit('delete_review', { property: review.property.id, type: review.propertyType, reviewId });
});
