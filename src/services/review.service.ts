import {
  ClubReview,
  ClubReviewModel,
  RestaurantReview,
  RestaurantReviewModel,
  ReviewModel,
  StayReview,
  StayReviewModel,
} from '@models';

export const reviewStay = (input: Partial<StayReview>) => {
  return StayReviewModel.create({ ...input });
};

export const reviewRestaurant = (input: Partial<RestaurantReview>) => {
  return RestaurantReviewModel.create({ ...input });
};

export const reviewClub = (input: Partial<ClubReview>) => {
  return ClubReviewModel.create({ ...input });
};

export const deleteReview = (_id: string, user: string) => {
  return ReviewModel.findOneAndDelete({ _id, user });
};

export const getReviews = () => {
  return ReviewModel.find({}).populate({ path: 'property', select: 'name', model: 'Club' });
};
