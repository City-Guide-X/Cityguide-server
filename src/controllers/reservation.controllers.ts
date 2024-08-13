import { AuthorizationError, BadRequestError, NotFoundError } from '@errors';
import { privateFields } from '@models';
import { createReservationInput, reservationAnalyticsInput, updateReservationInput } from '@schemas';
import {
  findReservationById,
  getAllEstablishmentReservations,
  getAllUserReservations,
  reservationAnalytics,
  reserveNightLife,
  reserveRestaurant,
  reserveStay,
  updateAccommodationAvailability,
  updateReservation,
  validateReservationInput,
} from '@services';
import { IReservation, PropertyType, Status } from '@types';
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createReservationHandler = asyncWrapper(
  async (req: Request<{}, {}, createReservationInput>, res: Response) => {
    const { id } = res.locals.user;
    const { ownerType, ...body } = req.body;
    let data: IReservation = { ...body, user: id };
    await validateReservationInput(data);
    let reservation;
    if (data.propertyType === PropertyType.STAY) reservation = await reserveStay(data, ownerType);
    else if (data.propertyType === PropertyType.RESTAURANT) reservation = await reserveRestaurant(data);
    else reservation = await reserveNightLife(data);
    res.status(201).json({ reservation: omit(reservation, privateFields) });
    if (data.propertyType === PropertyType.STAY)
      return await updateAccommodationAvailability(body.property, data.roomId!, -data.reservationCount);
    return;
  }
);

export const getReservationsHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id, type } = res.locals.user;
  const reservations = type === 'USER' ? await getAllUserReservations(id) : await getAllEstablishmentReservations(id);
  return res.status(200).json({ count: reservations.length, reservations });
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

export const reservationAnalyticsHandler = asyncWrapper(
  async (req: Request<{}, {}, reservationAnalyticsInput>, res: Response) => {
    const { id, type } = res.locals.user;
    const { property, propertyType, from, to, interval } = req.body;
    const analytics = await reservationAnalytics(id, type, from, to, interval, property, propertyType);
    return res.status(200).json({ analytics });
  }
);
