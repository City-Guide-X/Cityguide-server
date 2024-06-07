import { NotFoundError } from '@errors';
import { privateFields } from '@models';
import {
  addAccommodationInput,
  createStayInput,
  getStayDetailInput,
  removeAccommodationInput,
  updateAccommodationInput,
  updateStayInput,
} from '@schemas';
import {
  addAccommodation,
  createEstablishmentStay,
  createUserStay,
  deleteStay,
  getStayById,
  removeAccommodation,
  updateAccommodation,
  udpateStay,
} from '@services';
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';
import { Document } from 'mongoose';

export const createStayHandler = asyncWrapper(async (req: Request<{}, {}, createStayInput>, res: Response) => {
  const { id, type } = res.locals.user;
  const data = { ...req.body, partner: id };
  const stay: Document = type === 'USER' ? await createUserStay(data) : await createEstablishmentStay(data);
  return res.status(201).json({ stay: omit(stay.toJSON(), privateFields) });
});

export const getStayDetailHandler = asyncWrapper(async (req: Request<getStayDetailInput>, res: Response) => {
  const { stayId } = req.params;
  const stay = await getStayById(stayId);
  return res.status(200).json({ stay: omit(stay.toJSON(), privateFields) });
});

export const updateStayHandler = asyncWrapper(
  async (req: Request<updateStayInput['params'], {}, updateStayInput['body']>, res: Response) => {
    const { id } = res.locals.user;
    const {
      body,
      params: { stayId },
    } = req;
    await udpateStay(stayId, id, body);
    return res.sendStatus(204);
  }
);

export const deleteStayHandler = asyncWrapper(async (req: Request<removeAccommodationInput>, res: Response) => {
  const { id } = res.locals.user;
  const { stayId } = req.params;
  await deleteStay(stayId, id);
  return res.sendStatus(204);
});

export const addAccommodationHandler = asyncWrapper(
  async (req: Request<addAccommodationInput['params'], {}, addAccommodationInput['body']>, res: Response) => {
    const { id } = res.locals.user;
    const {
      body,
      params: { stayId },
    } = req;
    await addAccommodation(stayId, id, body);
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
    await updateAccommodation(stayId, id, accommodationId, body);
    return res.sendStatus(204);
  }
);

export const removeAccommodationHandler = asyncWrapper(
  async (req: Request<removeAccommodationInput>, res: Response) => {
    const { id } = res.locals.user;
    const { stayId, accommodationId } = req.params;
    await removeAccommodation(stayId, id, accommodationId);
    return res.sendStatus(204);
  }
);
