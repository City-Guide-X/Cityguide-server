import { Review, ReviewModel } from '@models';

export const createReview = (input: Partial<Review>) => {
  return ReviewModel.create({ ...input });
};

export const deleteReview = (_id: string, user: string) => {
  return ReviewModel.updateOne({ _id, user }, { deletedAt: Date.now() });
};

export const getReviews = (property: string) => {
  return ReviewModel.find({ property });
};
