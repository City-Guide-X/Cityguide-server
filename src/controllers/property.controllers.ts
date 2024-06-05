import { NotFoundError } from '@errors';
import { EstablishmentModel, privateFields, UserModel } from '@models';
import {
  createNightLifeInput,
  createReservationInput,
  createStayInput,
  getRestaurantDetailInput,
  getStayDetailInput,
} from '@schemas';
import {
  createEstablishmentStay,
  createNightLife,
  createRestaurant,
  createUserStay,
  getRestaurantById,
  getStayById,
} from '@services';
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';
import { Document } from 'mongoose';

// Stays
export const createStayHandler = asyncWrapper(async (req: Request<{}, {}, createStayInput>, res: Response) => {
  const { id, type } = res.locals.user;
  const data = { ...req.body, partner: id };
  const stay: Document = type === 'USER' ? await createUserStay(data) : await createEstablishmentStay(data);
  return res.status(201).json({ stay: omit(stay.toJSON(), privateFields) });
});

export const getStayDetailHandler = asyncWrapper(async (req: Request<getStayDetailInput>, res: Response) => {
  const { stayId } = req.params;
  const stay = await getStayById(stayId);
  if (!stay) throw new NotFoundError('Stay not found');
  return res.status(200).json({ stay: omit(stay.toJSON(), privateFields) });
});

// Restaurants
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

// NightLifes
export const createNightLifeHandler = asyncWrapper(
  async (req: Request<{}, {}, createNightLifeInput>, res: Response) => {
    const { id } = res.locals.user;
    const data = { ...req.body, establishment: id };
    const nightLife = await createNightLife(data);
    return res.status(201).json({ nightLife: omit(nightLife.toJSON(), privateFields) });
  }
);
