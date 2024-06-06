import { NotFoundError } from '@errors';
import { EstablishmentModel, privateFields, UserModel } from '@models';
import {
  addAccommodationInput,
  createNightLifeInput,
  createReservationInput,
  createStayInput,
  getNightLifeDetailInput,
  getRestaurantDetailInput,
  getStayDetailInput,
  removeAccommodationInput,
  updateAccommodationInput,
} from '@schemas';
import {
  addAccommodation,
  createEstablishmentStay,
  createNightLife,
  createRestaurant,
  createUserStay,
  getNightLifeById,
  getRestaurantById,
  getStayById,
  removeAccommodation,
  updateAccommodation,
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

export const addAccommodationHandler = asyncWrapper(
  async (req: Request<addAccommodationInput['params'], {}, addAccommodationInput['body']>, res: Response) => {
    const { id } = res.locals.user;
    const {
      body,
      params: { stayId },
    } = req;
    const stay = await addAccommodation(stayId, id, body);
    if (!stay.modifiedCount) throw new NotFoundError('Stay not found');
    return res.sendStatus(204);
  }
);

export const updateAccommodationHandler = asyncWrapper(
  async (req: Request<updateAccommodationInput['params'], {}, updateAccommodationInput['body']>, res: Response) => {
    const { id } = res.locals.user;
    const {
      body,
      params: { stayId, accommodationId },
    } = req;
    const stay = await updateAccommodation(stayId, id, accommodationId, body);
    if (!stay.modifiedCount) throw new NotFoundError('Stay not found');
    return res.sendStatus(204);
  }
);

export const removeAccommodationHandler = asyncWrapper(
  async (req: Request<removeAccommodationInput>, res: Response) => {
    const { id } = res.locals.user;
    const { stayId, accommodationId } = req.params;
    const stay = await removeAccommodation(stayId, id, accommodationId);
    console.log({ stay });
    if (!stay.modifiedCount) throw new NotFoundError('Stay not found');
    return res.sendStatus(204);
  }
);

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
    const nightlife = await createNightLife(data);
    return res.status(201).json({ nightlife: omit(nightlife.toJSON(), privateFields) });
  }
);

export const getNightLifeDetailHandler = asyncWrapper(async (req: Request<getNightLifeDetailInput>, res: Response) => {
  const { nightLifeId } = req.params;
  const nightlife = await getNightLifeById(nightLifeId);
  if (!nightlife) throw new NotFoundError('NightLife not found');
  return res.status(200).json({ nightlife: omit(nightlife.toJSON(), privateFields) });
});
