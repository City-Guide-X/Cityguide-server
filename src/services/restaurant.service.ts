import { AuthorizationError } from '@errors';
import { Restaurant, RestaurantModel, RestaurantReservationModel, RestaurantReviewModel } from '@models';

export const createRestaurant = async (input: Partial<Restaurant>) => {
  return RestaurantModel.create({ ...input });
};

export const getRestaurantById = async (_id: string) => {
  return RestaurantModel.findById(_id).populate('establishment', 'name email phoneNumber imgUrl', 'Establishment');
};

export const updateRestaurant = async (_id: string, establishment: string, body: Partial<Restaurant>) => {
  const restaurant = await RestaurantModel.findById(_id);
  if (restaurant?.establishment.toString() !== establishment) throw new AuthorizationError();
  return RestaurantModel.updateOne({ _id }, { $set: body });
};

export const deleteRestaurant = async (_id: string, establishment: string) => {
  const restaurant = await RestaurantModel.findById(_id);
  if (restaurant?.establishment.toString() !== establishment) throw new AuthorizationError();
  const deleted = await RestaurantModel.deleteOne({ _id });
  await RestaurantReservationModel.deleteMany({ property: _id });
  await RestaurantReviewModel.deleteMany({ property: _id });
  return deleted;
};

export const addMenu = async (_id: string, establishment: string, menu: Restaurant['menu']) => {
  const restaurant = await RestaurantModel.findById(_id);
  if (restaurant?.establishment.toString() !== establishment) throw new AuthorizationError();
  return RestaurantModel.updateOne({ _id }, { $addToSet: { menu: { $each: menu } } });
};

export const updateMenu = async (
  _id: string,
  establishment: string,
  menuId: string,
  body: Partial<Restaurant['menu'][0]>
) => {
  const restaurant = await RestaurantModel.findById(_id);
  if (restaurant?.establishment.toString() !== establishment) throw new AuthorizationError();
  if (!restaurant.menu.find((menuItem) => menuItem.id === menuId)) throw new AuthorizationError('Menu item not found');
  return RestaurantModel.updateOne({ _id, 'menu.id': menuId }, { $set: { 'menu.$': body } });
};
