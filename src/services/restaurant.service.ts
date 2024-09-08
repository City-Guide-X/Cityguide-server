import { AuthorizationError, BadRequestError, NotFoundError } from '@errors';
import { Restaurant, RestaurantModel } from '@models';
import { DayOfWeek, IMenu } from '@types';
import dayjs from 'dayjs';

export const createRestaurant = (input: Partial<Restaurant>) => {
  return RestaurantModel.create({ ...input });
};

export const getAllRestaurants = () => {
  return RestaurantModel.find({});
};

export const getPartnerRestaurants = (partner: string) => {
  return RestaurantModel.find({ partner }).sort('-updatedAt');
};

export const getRestaurantById = (_id: string) => {
  return RestaurantModel.findById(_id).populate({
    path: 'partner',
    select: 'name email phoneNumber imgUrl',
    model: 'Establishment',
  });
};

export const getTrendingRestaurants = () => {
  return RestaurantModel.aggregate([
    {
      $lookup: {
        from: 'reservations',
        localField: '_id',
        foreignField: 'property',
        as: 'reservations',
      },
    },
    { $addFields: { reservationCount: { $size: '$reservations' } } },
    { $sort: { reservationCount: -1 } },
    { $limit: 10 },
    { $project: { reservations: 0, reservationCount: 0 } },
  ]);
};

export const updateRestaurant = (_id: string, partner: string, body: Partial<Restaurant>) => {
  return RestaurantModel.updateOne({ _id, partner }, { $set: body });
};

export const deleteRestaurant = (_id: string, partner: string) => {
  return RestaurantModel.updateOne({ _id, partner }, { deletedAt: dayjs().toDate() });
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

export const searchRestaurant = async (
  children?: boolean,
  guests?: number,
  time?: string,
  day?: DayOfWeek,
  count: number = 1
) => {
  return RestaurantModel.aggregate([
    {
      $match: {
        ...(children && { 'details.children': children }),
        ...(guests && { 'details.reservation.max': { $gte: +guests } }),
        'details.reservation.available': { $gte: +count },
        ...(time &&
          day && {
            $expr: {
              $anyElementTrue: {
                $map: {
                  input: '$availability',
                  as: 'avail',
                  in: {
                    $and: [
                      { $eq: ['$$avail.day', day] },
                      {
                        $gte: [
                          {
                            $toDate: {
                              $concat: ['2000-01-01T', time, ':00Z'],
                            },
                          },
                          {
                            $toDate: {
                              $concat: ['2000-01-01T', '$$avail.from', ':00Z'],
                            },
                          },
                        ],
                      },
                      {
                        $lte: [
                          {
                            $dateAdd: {
                              startDate: {
                                $toDate: {
                                  $concat: ['2000-01-01T', time, ':00Z'],
                                },
                              },
                              unit: 'hour',
                              amount: 1,
                            },
                          },
                          {
                            $toDate: {
                              $concat: ['2000-01-01T', '$$avail.to', ':00Z'],
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          }),
      },
    },
  ]);
};
