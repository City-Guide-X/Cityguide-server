import { BadRequestError, NotFoundError } from '@errors';
import { privateFields } from '@models';
import {
  cancelReservationInput,
  createReservationInput,
  getReservationDetailInput,
  reservationAnalyticsInput,
  reservationRefInput,
  updateReservationInput,
} from '@schemas';
import {
  createReservation,
  findReservationById,
  findReservationByRef,
  getPartnerReservations,
  getUserReservations,
  reservationAnalytics,
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
    const body = req.body;
    let data: IReservation = { ...body, user: id };
    await validateReservationInput(data);
    const reservation = await createReservation(data);
    res.status(201).json({ reservation: omit(reservation, privateFields) });
    if (data.propertyType === PropertyType.STAY)
      return await updateAccommodationAvailability(body.property, data.accommodations!);
    return;
  }
);

export const getUserReservationsHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = res.locals.user;
  const reservations = await getUserReservations(id);
  return res
    .status(200)
    .json({ count: reservations.length, reservations: reservations.map((r) => omit(r.toJSON(), privateFields)) });
});

export const getPartnerReservationsHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = res.locals.user;
  const reservations = await getPartnerReservations(id);
  return res
    .status(200)
    .json({ count: reservations.length, reservations: reservations.map((r) => omit(r.toJSON(), privateFields)) });
});

export const getReservationDetailsHandler = asyncWrapper(
  async (req: Request<getReservationDetailInput>, res: Response) => {
    const { reservationId } = req.params;
    const reservation = await findReservationById(reservationId);
    if (!reservation) throw new NotFoundError('Reservation not found');
    return res.status(200).json({ reservation: omit(reservation.toJSON(), privateFields) });
  }
);

export const getReservationByRefHandler = asyncWrapper(async (req: Request<reservationRefInput>, res: Response) => {
  const { reservationRef } = req.params;
  const reservation = await findReservationByRef(reservationRef);
  if (!reservation) throw new NotFoundError('Reservation not found');
  return res.status(200).json({ reservation: omit(reservation.toJSON(), privateFields) });
});

export const cancelReservationHandler = asyncWrapper(async (req: Request<cancelReservationInput>, res: Response) => {
  const { id } = res.locals.user;
  const { reservationId } = req.params;
  const { matchedCount, modifiedCount } = await updateReservation(reservationId, false, id, {
    status: Status.CANCELLED,
  });
  if (!matchedCount) throw new NotFoundError('Reservation not found');
  if (!modifiedCount) throw new BadRequestError('Reservation not cancelled');
  return res.sendStatus(204);
});

export const updateReservationHandler = asyncWrapper(
  async (req: Request<{}, {}, updateReservationInput>, res: Response) => {
    const { id } = res.locals.user;
    const { id: itemId, status } = req.body;
    const { matchedCount, modifiedCount } = await updateReservation(itemId, true, id, { status });
    if (!matchedCount) throw new NotFoundError('Reservation not found');
    if (!modifiedCount) throw new BadRequestError();
    return res.sendStatus(204);
  }
);

export const reservationAnalyticsHandler = asyncWrapper(
  async (req: Request<{}, {}, reservationAnalyticsInput>, res: Response) => {
    const { id } = res.locals.user;
    const { property, propertyType, from, to, interval } = req.body;
    const analytics = await reservationAnalytics(id, from, to, interval, property, propertyType);
    return res.status(200).json({ analytics });
  }
);
