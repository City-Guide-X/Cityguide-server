import { AuthorizationError, NotFoundError } from '@errors';
import { ReservationModel, Restaurant, RestaurantModel, ReviewModel } from '@models';

export const createRestaurant = async (input: Partial<Restaurant>) => {
  return RestaurantModel.create({ ...input });
};

export const getAllRestaurants = () => RestaurantModel.find({});

export const getRestaurantById = async (_id: string) => {
  const restaurant = await RestaurantModel.findById(_id).populate(
    'establishment',
    'name email phoneNumber imgUrl',
    'Establishment'
  );
  if (!restaurant) throw new NotFoundError('Restaurant not found');
  return restaurant;
};

export const updateRestaurant = async (_id: string, establishment: string, body: Partial<Restaurant>) => {
  const restaurant = await RestaurantModel.findById(_id);
  if (!restaurant) throw new NotFoundError('Restaurant not found');
  if (restaurant.establishment.toString() !== establishment) throw new AuthorizationError();
  const updated = await RestaurantModel.updateOne({ _id }, { $set: body });
  if (!updated.modifiedCount) throw new NotFoundError('Restaurant not found');
};

export const deleteRestaurant = async (_id: string, establishment: string) => {
  const restaurant = await RestaurantModel.findById(_id);
  if (!restaurant) throw new NotFoundError('Restaurant not found');
  if (restaurant.establishment.toString() !== establishment) throw new AuthorizationError();
  const deleted = await RestaurantModel.deleteOne({ _id });
  await ReservationModel.deleteMany({ property: _id });
  await ReviewModel.deleteMany({ property: _id });
  if (!deleted.deletedCount) throw new NotFoundError('Restaurant not found');
};

export const addMenu = async (_id: string, establishment: string, menu: Restaurant['menu']) => {
  const restaurant = await RestaurantModel.findById(_id);
  if (!restaurant) throw new NotFoundError('Restaurant not found');
  if (restaurant.establishment.toString() !== establishment) throw new AuthorizationError();
  const update = await RestaurantModel.updateOne({ _id }, { $addToSet: { menu: { $each: menu } } });
  if (!update.modifiedCount) throw new NotFoundError('Restaurant not found');
};

export const updateMenu = async (
  _id: string,
  establishment: string,
  menuId: string,
  body: Partial<Restaurant['menu'][0]>
) => {
  const restaurant = await RestaurantModel.findById(_id);
  if (!restaurant) throw new NotFoundError('Restaurant not found');
  if (restaurant.establishment.toString() !== establishment) throw new AuthorizationError();
  if (!restaurant.menu.find((menuItem) => menuItem.id === menuId)) throw new AuthorizationError('Menu item not found');
  const updated = await RestaurantModel.updateOne({ _id, 'menu.id': menuId }, { $set: { 'menu.$': body } });
  if (!updated.modifiedCount) throw new NotFoundError('Menu item not found');
};

export const removeMenu = async (_id: string, establishment: string, menuId: string) => {
  const restaurant = await RestaurantModel.findById(_id);
  if (!restaurant) throw new NotFoundError('Restaurant not found');
  if (restaurant.establishment.toString() !== establishment) throw new AuthorizationError();
  if (!restaurant.menu.find((menuItem) => menuItem.id === menuId)) throw new AuthorizationError('Menu item not found');
  const udpated = await RestaurantModel.updateOne({ _id }, { $pull: { menu: { id: menuId } } });
  if (!udpated.modifiedCount) throw new NotFoundError('Menu item not found');
};
