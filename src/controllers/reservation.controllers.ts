import { AuthorizationError, BadRequestError, NotFoundError } from '@errors';
import { privateFields } from '@models';
import { createReservationInput, updateReservationInput } from '@schemas';
import {
  createReservation,
  findReservationById,
  getAllEstablishmentReservations,
  getAllUserReservations,
  reserveClub,
  reserveRestaurant,
  reserveStay,
  updateAccommodationAvailability,
  updateReservation,
  validateReservationInput,
} from '@services';
import { PropertyType, Status } from '@types';
import { asyncWrapper, log } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createReservationHandler = asyncWrapper(
  async (req: Request<{}, {}, createReservationInput>, res: Response) => {
    const { id } = res.locals.user;
    const { property, ...body } = req.body;
    const data = { ...body, property: property as any, user: id };
    const notValid = await validateReservationInput(data);
    if (notValid) throw new BadRequestError(notValid);
    const reservation =
      data.propertyType === PropertyType.STAY
        ? await reserveStay(data)
        : data.propertyType === PropertyType.RESTAURANT
        ? await reserveRestaurant(data)
        : await reserveClub(data);
    res.status(201).json({ reservation: omit(reservation, privateFields) });
    if (data.propertyType === PropertyType.STAY)
      return await updateAccommodationAvailability(property, data.roomId!, -data.reservationCount);
    return;
  }
);

export const getReservationsHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id, type } = res.locals.user;
  const reservations = type === 'USER' ? await getAllUserReservations(id) : await getAllEstablishmentReservations(id);
  return res.status(200).json({ reservations });
});

export const updateReservationHandler = asyncWrapper(
  async (req: Request<{}, {}, updateReservationInput>, res: Response) => {
    const { id, type } = res.locals.user;
    const { id: itemId, status } = req.body;
    if (type === 'USER' && status !== Status.CANCELLED) throw new AuthorizationError();
    const reservation = await findReservationById(itemId).populate('establishment', 'name', 'Establishment');
    if (!reservation) throw new NotFoundError();
    if (
      (type === 'ESTABLISHMENT' && reservation.user.toString() !== id) ||
      (type === 'USER' && reservation.user.toString !== id)
    )
      throw new AuthorizationError();
    const isUpdated = await updateReservation(itemId, { status });
    if (!isUpdated.modifiedCount) throw new BadRequestError();
    return res.sendStatus(204);
  }
);
