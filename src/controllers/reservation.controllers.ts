import { NotFoundError } from '@errors';
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
  createNotification,
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
import { EntityType, IReservation, NotificationType, PropertyType, Status } from '@types';
import { asyncWrapper } from '@utils';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { omit } from 'lodash';
import mongoose from 'mongoose';

export const createReservationHandler = asyncWrapper(
  async (req: Request<{}, {}, createReservationInput>, res: Response) => {
    const { id } = res.locals.user;
    let data: IReservation = { ...req.body, user: id };
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await validateReservationInput(data);
      const reservation = await createReservation(data);
      const reservationResponse = omit(reservation.toJSON(), privateFields);
      const populatedProperty: any = await reservation.populate({
        path: 'property',
        select: 'type name accommodation -_id',
      });

      const notification = {
        recipient: data.partner,
        recipientType: EntityType.ESTABLISHMENT,
        type: NotificationType.RESERVATION,
        title: 'New Reservation',
        message: `A new reservation (Ref: ${reservation.reservationRef}) has been made at your ${
          populatedProperty.property.type ?? 'Restaurant'
        } — ${populatedProperty.property.name}! The reservation is for ${dayjs(data.checkInDay).format(
          'dddd, MMMM D, YYYY [at] h:mm A'
        )}, with ${
          data.noOfGuests.adults + data.noOfGuests.children
        } guest(s). Head to your dashboard for more details`,
      };
      const [newNotification] = await Promise.all([
        createNotification(notification),
        data.propertyType === PropertyType.STAY
          ? updateAccommodationAvailability(data.property, data.accommodations!)
          : Promise.resolve(),
      ]);
      await session.commitTransaction();
      session.endSession();

      const socketId = onlineUsers.get(data.partner);
      if (socketId) {
        res.locals.io?.to(socketId).emit('new_reservation', reservationResponse);
        res.locals.io?.to(socketId).emit('new_notification', omit(newNotification.toJSON(), privateFields));
      }
      if (data.propertyType === PropertyType.STAY) {
        const updatedAccommodations = populatedProperty.property.accommodation.filter((a: any) =>
          data.accommodations!.some((da) => da.accommodationId === a.id)
        );
        res.locals.io?.emit('stay_acc', { id: data.property, action: 'update', body: updatedAccommodations });
      }

      return res.status(201).json({ reservation: reservationResponse });
    } catch (err: any) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const reservation = await updateReservation(reservationId, false, id, { status: Status.CANCELLED });
    if (!reservation) throw new NotFoundError('Reservation not found');
    const populatedProperty: any = await reservation.populate({
      path: 'property',
      select: 'type name -_id',
    });

    const notification = {
      recipient: reservation.partner,
      recipientType: EntityType.ESTABLISHMENT,
      type: NotificationType.RESERVATION,
      title: 'Reservation Cancelled',
      message: `A reservation (Ref: ${reservation.reservationRef}) at your ${
        populatedProperty.property.type ?? 'Restaurant'
      } — ${populatedProperty.property.name} has been cancelled. The reservation was for ${dayjs(
        reservation.checkInDay
      ).format('dddd, MMMM D, YYYY [at] h:mm A')}, with ${
        reservation.noOfGuests.adults + reservation.noOfGuests.children
      } guest(s). Head to your dashboard for more details`,
    };
    const newNotification = await createNotification(notification);
    await session.commitTransaction();
    session.endSession();

    const socketId = onlineUsers.get(reservation.partner.toString());
    if (socketId) res.locals.io?.to(socketId).emit('new_notification', omit(newNotification.toJSON(), privateFields));
    res.locals.io?.emit('update_reservation', { reservationId, status: Status.CANCELLED });
    return res.sendStatus(204);
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

export const updateReservationHandler = asyncWrapper(
  async (req: Request<{}, {}, updateReservationInput>, res: Response) => {
    const { id } = res.locals.user;
    const { id: reservationId, status } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const reservation = await updateReservation(reservationId, true, id, { status });
      if (!reservation) throw new NotFoundError('Reservation not found');
      const populatedProperty: any = await reservation.populate({
        path: 'property',
        select: 'type name -_id',
      });

      const notification = {
        recipient: reservation.user,
        recipientType: EntityType.USER,
        type: NotificationType.RESERVATION,
        title: `Reservation ${reservation.status}`,
        message: `Your reservation (Ref: ${reservation.reservationRef}) at ${
          populatedProperty.property.name
        } is ${reservation.status.toLowerCase()}. The reservation was for ${dayjs(reservation.checkInDay).format(
          'dddd, MMMM D, YYYY [at] h:mm A'
        )}, with ${
          reservation.noOfGuests.adults + reservation.noOfGuests.children
        } guest(s). Head to your dashboard for more details`,
      };
      const newNotification = await createNotification(notification);
      await session.commitTransaction();
      session.endSession();

      const socketId = onlineUsers.get(reservation.user.toString());
      if (socketId) res.locals.io?.to(socketId).emit('new_notification', omit(newNotification.toJSON(), privateFields));
      res.locals.io?.emit('update_reservation', { reservationId, status });
      return res.sendStatus(204);
    } catch (err: any) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
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
