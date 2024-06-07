import { privateFields } from '@models';
import {
  addMenuInput,
  createReservationInput,
  deleteRestaurantInput,
  getRestaurantDetailInput,
  removeMenuInput,
  updateMenuInput,
  updateRestaurantInput,
} from '@schemas';
import {
  addMenu,
  createRestaurant,
  deleteRestaurant,
  getRestaurantById,
  removeMenu,
  updateMenu,
  updateRestaurant,
} from '@services';
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
    await updateRestaurant(restaurantId, id, body);
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
    await addMenu(restaurantId, id, body);
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
