import { BadRequestError, NotFoundError } from '@errors';
import { privateFields } from '@models';
import { canReviewInput, createReviewInput, deleteReviewInput, getPropertyReviewInput } from '@schemas';
import {
  canReview,
  createNotification,
  createReview,
  deleteReview,
  getReviews,
  updatePropertyReviewDetail,
} from '@services';
import { EntityType, NotificationType } from '@types';
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';
import mongoose from 'mongoose';

export const createReviewHandler = asyncWrapper(async (req: Request<{}, {}, createReviewInput>, res: Response) => {
  const { id } = res.locals.user;
  const data = { ...req.body, user: id };
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const isValid = await canReview(data.property, data.propertyType, id);
    if (!isValid) throw new BadRequestError('You cannot review this property');
    const review = await createReview(data);
    const reviewResponse = omit(review.toJSON(), privateFields);
    const populatedReview: any = await review.populate({ path: 'property', select: 'name type partner -_id' });

    const notification = {
      recipient: populatedReview.property.partner,
      recipientType: EntityType.ESTABLISHMENT,
      type: NotificationType.REVIEW,
      title: 'New Review',
      message: `Your ${populatedReview.property.type ?? 'Restaurant'} — ${
        populatedReview.property.name
      } has recieved a new review! Check out what your guest has to say. Visit your dashboard for more details`,
    };
    const [newNotification] = await Promise.all([
      createNotification(notification),
      updatePropertyReviewDetail(data.property, data.propertyType),
    ]);
    await session.commitTransaction();
    session.endSession();

    const socketId = onlineUsers.get(populatedReview.property.partner);
    if (socketId) res.locals.io?.to(socketId).emit('new_notification', newNotification);
    res.locals.io?.emit('new_review', { property: data.property, type: data.propertyType, review: reviewResponse });
    return res.status(201).json({ review: reviewResponse });
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

export const getPropertyReviewsHandler = asyncWrapper(async (req: Request<getPropertyReviewInput>, res: Response) => {
  const { propertyId } = req.params;
  const reviews = await getReviews(propertyId);
  return res.status(200).json({ reviews: reviews.map((review) => omit(review.toJSON(), privateFields)) });
});

export const getCanReviewHandler = asyncWrapper(async (req: Request<{}, {}, {}, canReviewInput>, res: Response) => {
  const { id } = res.locals.user;
  const { propertyId, propertyType } = req.query;
  const isValid = await canReview(propertyId, propertyType, id);
  return res.status(200).json({ canReview: isValid });
});

export const deleteReviewHandler = asyncWrapper(async (req: Request<deleteReviewInput>, res: Response) => {
  const { id } = res.locals.user;
  const { reviewId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const review = await deleteReview(reviewId, id);
    if (!review) throw new NotFoundError('Review not found');
    const populatedReview: any = await review.populate({ path: 'property', select: 'name type partner -_id' });

    const notification = {
      recipient: populatedReview.property.partner,
      recipientType: EntityType.ESTABLISHMENT,
      type: NotificationType.REVIEW,
      title: 'New Review',
      message: `Your ${populatedReview.property.type ?? 'Restaurant'} — ${
        populatedReview.property.name
      } has recieved a new review! Check out what your guest has to say. Visit your dashboard for more details`,
    };
    const [newNotification] = await Promise.all([
      createNotification(notification),
      updatePropertyReviewDetail(review.property.id, review.propertyType),
    ]);
    await session.commitTransaction();
    session.endSession();

    const socketId = onlineUsers.get(populatedReview.property.partner);
    if (socketId) res.locals.io?.to(socketId).emit('new_notification', newNotification);
    res.locals.io?.emit('delete_review', { property: review.property.id, type: review.propertyType, reviewId });
    return res.sendStatus(204);
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});
