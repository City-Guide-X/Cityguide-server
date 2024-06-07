import { AuthorizationError } from '@errors';
import { Restaurant, RestaurantModel, RestaurantReservationModel, RestaurantReviewModel } from '@models';

export const createRestaurant = async (input: Partial<Restaurant>) => {
  return RestaurantModel.create({ ...input });
};

export const getRestaurantById = async (_id: string) => {
  return RestaurantModel.findById(_id).populate('establishment', 'name email phoneNumber imgUrl', 'Establishment');
};

export const deleteRestaurant = async (_id: string, establishment: string) => {
  const restaurant = await RestaurantModel.findById(_id);
  if (restaurant?.establishment.toString() !== establishment) throw new AuthorizationError();
  const deleted = await RestaurantModel.deleteOne({ _id });
  await RestaurantReservationModel.deleteMany({ property: _id });
  await RestaurantReviewModel.deleteMany({ property: _id });
  return deleted;
};
