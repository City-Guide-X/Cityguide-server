import { BadRequestError, NotFoundError } from '@errors';
import { privateFields } from '@models';
import {
  addMenuInput,
  createReservationInput,
  createRestaurantInput,
  deleteRestaurantInput,
  getAllRestautantInput,
  getRestaurantDetailInput,
  removeMenuInput,
  searchRestaurantInput,
  updateMenuInput,
  updateRestaurantInput,
} from '@schemas';
import {
  addMenu,
  calculateDistance,
  createRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  getPartnerRestaurants,
  getRestaurantById,
  removeMenu,
  searchRestaurant,
  updateMenu,
  updateRestaurant,
} from '@services';
import { ILatLng } from '@types';
import { asyncWrapper, summarizeRestaurant } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createRestaurantHandler = asyncWrapper(
  async (req: Request<{}, {}, createRestaurantInput>, res: Response) => {
    const { id } = res.locals.user;
    let data = { ...req.body, partner: id };
    const summary = (await summarizeRestaurant(data)) as string;
    if (summary) data = { ...data, summary };
    const reservation = await createRestaurant(data);
    return res.status(201).json({ reservation: omit(reservation.toJSON(), privateFields) });
  }
);

export const getAllRestaurantHandler = asyncWrapper(
  async (req: Request<{}, {}, {}, getAllRestautantInput>, res: Response) => {
    const geoLocation = req.query;
    const properties = await getAllRestaurants();
    if (geoLocation.lat && geoLocation.lng) {
      const locations = properties.map((restaurant) => restaurant.address.geoLocation);
      const restaurantDistances = await calculateDistance([geoLocation as ILatLng], locations);
      if (!restaurantDistances)
        return res.status(200).json({
          count: properties.length,
          properties: properties.map((restaurant) => omit(restaurant.toJSON(), privateFields)),
        });
      const result = properties
        .map((property, i) => {
          const restaurant = {
            ...omit(property.toJSON(), privateFields),
            locationInfo: {
              distance: restaurantDistances[i].distance?.value || 999999999,
              distanceInWords: restaurantDistances[i].distance?.text || '',
              duration: restaurantDistances[i].duration?.text || '',
            },
          };
          return restaurant;
        })
        .sort((a, b) => a.locationInfo.distance - b.locationInfo.distance);
      return res.status(200).json({ count: result.length, properties: result });
    }
    return res.status(200).json({
      count: properties.length,
      properties: properties.map((restaurant) => omit(restaurant.toJSON(), privateFields)),
    });
  }
);

export const getPartnerRestaurantsHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = res.locals.user;
  const properties = await getPartnerRestaurants(id);
  return res
    .status(200)
    .json({ count: properties.length, properties: properties.map((r) => omit(r.toJSON(), privateFields)) });
});

export const getRestaurantDetailHandler = asyncWrapper(
  async (req: Request<getRestaurantDetailInput>, res: Response) => {
    const { restaurantId } = req.params;
    const restaurant = await getRestaurantById(restaurantId);
    if (!restaurant) throw new NotFoundError('Restaurant not found');
    return res.status(200).json({ restaurant: omit(restaurant.toJSON(), privateFields) });
  }
);

export const updateRestaurantHandler = asyncWrapper(
  async (req: Request<updateRestaurantInput['params'], {}, updateRestaurantInput['body']>, res: Response) => {
    const { id } = res.locals.user;
    const {
      body,
      params: { restaurantId },
    } = req;
    const { matchedCount, modifiedCount } = await updateRestaurant(restaurantId, id, body);
    if (!matchedCount) throw new NotFoundError('Restaurant not found');
    if (!modifiedCount) throw new BadRequestError();
    return res.sendStatus(204);
  }
);

export const deleteRestaurantHandler = asyncWrapper(async (req: Request<deleteRestaurantInput>, res: Response) => {
  const { id } = res.locals.user;
  const { restaurantId } = req.params;
  await deleteRestaurant(restaurantId, id);
  return res.sendStatus(204);
});

export const addMenuHandler = asyncWrapper(
  async (req: Request<addMenuInput['params'], {}, addMenuInput['body']>, res: Response) => {
    const { id } = res.locals.user;
    const {
      body,
      params: { restaurantId },
    } = req;
    const { matchedCount, modifiedCount } = await addMenu(restaurantId, id, body);
    if (!matchedCount) throw new NotFoundError('Restaurant not found');
    if (!modifiedCount) throw new BadRequestError('Menu item not added');
    return res.sendStatus(204);
  }
);

export const updateMenuHandler = asyncWrapper(
  async (req: Request<updateMenuInput['params'], {}, updateMenuInput['body']>, res: Response) => {
    const { id } = res.locals.user;
    const {
      body,
      params: { restaurantId, menuId },
    } = req;
    await updateMenu(restaurantId, id, menuId, body);
    return res.sendStatus(204);
  }
);

export const removeMenuHandler = asyncWrapper(async (req: Request<removeMenuInput>, res: Response) => {
  const { id } = res.locals.user;
  const { restaurantId, menuId } = req.params;
  await removeMenu(restaurantId, id, menuId);
  return res.sendStatus(204);
});

export const searchRestaurantHandler = asyncWrapper(
  async (req: Request<{}, {}, {}, searchRestaurantInput>, res: Response) => {
    const { children, count, lat, lng, guests } = req.query;
    const geoLocation = { lat, lng };
    const restaurants = await searchRestaurant(!!children, guests, count);
    return res.status(200).json({ count: restaurants.length, restaurants });
  }
);
