import { Review, ReviewModel } from '@models';

export const createReview = (input: Partial<Review>) => {
  return ReviewModel.create({ ...input });
};

export const deleteReview = (_id: string, user: string) => {
  return ReviewModel.findOneAndDelete({ _id, user });
};

export const getReviews = (property: string) => {
  return ReviewModel.find({ property });
};
