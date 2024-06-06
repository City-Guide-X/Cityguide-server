import { Restaurant, RestaurantModel } from '@models';

export const createRestaurant = async (input: Partial<Restaurant>) => {
  return RestaurantModel.create({ ...input });
};

export const getRestaurantById = async (_id: string) => {
  return RestaurantModel.findById(_id).populate('establishment', 'name email phoneNumber imgUrl', 'Establishment');
};
