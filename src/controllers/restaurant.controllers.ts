import { NotFoundError } from '@errors';
import { privateFields } from '@models';
import { createReservationInput, getRestaurantDetailInput } from '@schemas';
import { createRestaurant, getRestaurantById } from '@services';
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createRestaurantHandler = asyncWrapper(
  async (req: Request<{}, {}, createReservationInput>, res: Response) => {
    const { id } = res.locals.user;
    const data = { ...req.body, establishment: id };
    const reservation = await createRestaurant(data);
    return res.status(201).json({ reservation: omit(reservation.toJSON(), privateFields) });
  }
);

export const getRestaurantDetailHandler = asyncWrapper(
  async (req: Request<getRestaurantDetailInput>, res: Response) => {
    const { restaurantId } = req.params;
    const restaurant = await getRestaurantById(restaurantId);
    if (!restaurant) throw new NotFoundError('Restaurant not found');
    return res.status(200).json({ restaurant: omit(restaurant.toJSON(), privateFields) });
  }
);
