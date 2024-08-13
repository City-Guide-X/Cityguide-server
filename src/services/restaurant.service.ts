import { AuthorizationError, BadRequestError, NotFoundError } from '@errors';
import { ReservationModel, Restaurant, RestaurantModel, ReviewModel } from '@models';
import { IMenu } from '@types';

export const createRestaurant = (input: Partial<Restaurant>) => {
  return RestaurantModel.create({ ...input });
};

export const getAllRestaurants = () => RestaurantModel.find({});

export const getRestaurantById = (_id: string) => {
  return RestaurantModel.findById(_id).populate('establishment', 'name email phoneNumber imgUrl');
};

export const updateRestaurant = (_id: string, partner: string, body: Partial<Restaurant>) => {
  return RestaurantModel.updateOne({ _id, partner }, { $set: body });
};

export const deleteRestaurant = async (_id: string, partner: string) => {
  const { deletedCount } = await RestaurantModel.deleteOne({ _id, partner });
  if (!deletedCount) throw new NotFoundError('Restaurant not found');
  await Promise.all([ReservationModel.deleteMany({ property: _id }), ReviewModel.deleteMany({ property: _id })]);
};

export const addMenu = (_id: string, partner: string, menu: IMenu[]) => {
  return RestaurantModel.updateOne({ _id, partner }, { $addToSet: { menu: { $each: menu } } });
};

export const updateMenu = async (_id: string, partner: string, menuId: string, body: Partial<IMenu>) => {
  const { matchedCount, modifiedCount } = await RestaurantModel.updateOne(
    { _id, partner, 'menu.id': menuId },
    { $set: { 'menu.$': body } }
  );
  if (!matchedCount) {
    const restaurant = await RestaurantModel.findById(_id);
    if (restaurant?.partner.toJSON() !== partner) throw new AuthorizationError();
    if (!restaurant.menu.find((m) => m.id === menuId)) throw new BadRequestError('Menu item not found');
    throw new NotFoundError('Restaurant not found');
  }
  if (!modifiedCount) throw new NotFoundError('Restaurant not found');
};

export const removeMenu = async (_id: string, partner: string, menuId: string) => {
  const { matchedCount, modifiedCount } = await RestaurantModel.updateOne(
    { _id, partner, 'menu.id': menuId },
    { $pull: { menu: { id: menuId } } }
  );
  if (!matchedCount) {
    const restaurant = await RestaurantModel.findById(_id);
    if (restaurant?.partner.toJSON() !== partner) throw new AuthorizationError();
    if (!restaurant.menu.find((m) => m.id === menuId)) throw new BadRequestError('Menu item not found');
    throw new NotFoundError('Restaurant not found');
  }
  if (!modifiedCount) throw new NotFoundError('Restaurant not found');
};
