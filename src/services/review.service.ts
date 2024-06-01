import { Review, ReviewModel } from '@models';

export const createReview = (input: Partial<Review>, user: string, establishment: string) => {
  return ReviewModel.create({ ...input, user, establishment });
};

export const getEstablishmentReviews = (establishment: string) => {
  return ReviewModel.find({ establishment });
};

export const deleteReview = (_id: string, user: string) => {
  return ReviewModel.findOneAndDelete({ _id, user });
};
