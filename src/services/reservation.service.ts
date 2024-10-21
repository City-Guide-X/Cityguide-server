import { BadRequestError } from '@errors';
import { Reservation, ReservationModel } from '@models';
import { IReservation, PropertyType, StayType } from '@types';
import { isFuture, isValidDate } from '@utils';
import dayjs from 'dayjs';
import { Types } from 'mongoose';
import { getRestaurantById } from './restaurant.service';
import { getStayById } from './stay.service';

export const createReservation = (option: Partial<Reservation>) => {
  return ReservationModel.create({ ...option });
};

export const getUserReservations = (user: string) => {
  return ReservationModel.find({ user });
};

export const getPartnerReservations = (partner: string) => {
  return ReservationModel.find({ partner }).populate({
    path: 'user',
    select: 'firstName lastName email phoneNumber imgUrl',
    model: 'User',
  });
};

export const findReservationById = (_id: string) => {
  return ReservationModel.findOne({ _id });
};

export const findReservationByRef = (reservationRef: string) => {
  return ReservationModel.findOne({ reservationRef });
};

export const updateReservation = (_id: string, isAdmin: boolean, id: string, option: Partial<Reservation>) => {
  const searchQuery = { _id, ...(isAdmin ? { partner: id } : { user: id }) };
  return ReservationModel.findOneAndUpdate(searchQuery, { ...option });
};

export const reservationAnalytics = (
  partner: string,
  from: Date,
  to: Date,
  interval: string,
  property?: string,
  propertyType?: PropertyType
) => {
  return ReservationModel.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(from), $lte: new Date(dayjs(to).add(1, 'd').toISOString()) },
        partner: new Types.ObjectId(partner),
        ...(property && { property: new Types.ObjectId(property) }),
        ...(propertyType && { propertyType }),
      },
    },
    {
      $densify: {
        field: 'createdAt',
        range: {
          step: 1,
          unit: 'day',
          bounds: [new Date(from), new Date(dayjs(to).add(1, 'd').toISOString())],
        },
      },
    },
    {
      $group: {
        _id: {
          name: {
            $cond: [
              { $eq: [interval, 'daily'] },
              { $dateToString: { date: '$createdAt', format: '%b %d, %Y' } },
              {
                $cond: [
                  { $eq: [interval, 'weekly'] },
                  {
                    $let: {
                      vars: {
                        weekStart: {
                          $subtract: [
                            '$createdAt',
                            { $multiply: [{ $subtract: [{ $dayOfWeek: '$createdAt' }, 1] }, 24 * 60 * 60 * 1000] },
                          ],
                        },
                        weekEnd: {
                          $add: [
                            '$createdAt',
                            { $multiply: [{ $subtract: [7, { $dayOfWeek: '$createdAt' }] }, 24 * 60 * 60 * 1000] },
                          ],
                        },
                      },
                      in: {
                        $concat: [
                          { $dateToString: { date: '$$weekStart', format: '%b %d' } },
                          ' - ',
                          { $dateToString: { date: '$$weekEnd', format: '%b %d' } },
                        ],
                      },
                    },
                  },
                  { $dateToString: { date: '$createdAt', format: '%b' } },
                ],
              },
            ],
          },
        },
        Reservations: {
          $sum: { $cond: [{ $lte: ['$status', null] }, 0, { $cond: [{ $eq: ['$status', 'Cancelled'] }, 0, 1] }] },
        },
        'Cancelled Reservations': {
          $sum: { $cond: [{ $lte: ['$status', null] }, 0, { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] }] },
        },
        sortDate: { $first: '$createdAt' },
      },
    },
    {
      $sort: { sortDate: 1 },
    },
    {
      $project: { name: '$_id.name', _id: 0, Reservations: 1, 'Cancelled Reservations': 1 },
    },
  ]);
};

export const validateReservationInput = async ({
  propertyType,
  property,
  reservationCount,
  accommodations,
  checkInDay,
  checkInTime,
  checkOutDay,
  checkOutTime,
  noOfGuests,
  payReference,
  price,
  useSavedCard,
}: IReservation) => {
  if (isFuture(checkInDay!, checkInTime!)) throw new BadRequestError('The reservation date must be in the future');
  if (propertyType === PropertyType.STAY) {
    const stay = await getStayById(property);
    if (!stay) throw new BadRequestError('Invalid Stay ID');
    if ([StayType.APARTMENT, StayType.BnB].includes(stay.type) && !payReference && !useSavedCard)
      throw new BadRequestError('Payment is required for this reservation');
    if (
      (stay.cancellationPolicy || (stay.partner as any).cancellationPolicy) &&
      price &&
      !payReference &&
      !useSavedCard
    )
      throw new BadRequestError(
        "Credit card information is required for this reservation due to the property's cancellation policy."
      );
    if (dayjs(checkOutDay).diff(checkInDay, 'd') > stay.maxDays)
      throw new BadRequestError('The reservation exceeds the maximum stay');
    accommodations?.forEach(({ accommodationId, reservationCount, noOfGuests }) => {
      const accommodation = stay.accommodation.find((a) => a.id === accommodationId);
      if (!accommodation) throw new BadRequestError(`The provided accommodation ID ${accommodationId} is not valid`);
      if (accommodation.available < reservationCount!)
        throw new BadRequestError(`Not enough for reservation of accommodation ${accommodationId}`);
      if (!accommodation.children && noOfGuests!.children)
        throw new BadRequestError(`Children are not allowed in the accommodation ${accommodationId}`);
      if (noOfGuests!.adults + noOfGuests!.children > accommodation.maxGuests)
        throw new BadRequestError(`The provided number of guests exceeds accommodation ${accommodationId} capacity`);
    });
    return true;
  }
  if (propertyType === PropertyType.RESTAURANT) {
    const restaurant = await getRestaurantById(property);
    if (!restaurant) throw new BadRequestError('Invalid Restaurant ID');
    const reservation = restaurant.details.reservation;
    if (!reservation) throw new BadRequestError("This restaurant doesn't accept reservations");
    if (
      (restaurant.cancellationPolicy || (restaurant.partner as any).cancellationPolicy) &&
      price &&
      !payReference &&
      !useSavedCard
    )
      throw new BadRequestError(
        "Credit card information is required for this reservation due to the property's cancellation policy."
      );
    const isAvailable = [
      restaurant.availability
        .map(({ day, from, to }) => isValidDate(checkInDay!, checkInTime!, day, from, to))
        .some(Boolean),
      restaurant.availability
        .map(({ day, from, to }) => isValidDate(checkOutDay!, checkOutTime!, day, from, to))
        .some(Boolean),
    ].every(Boolean);
    if (!isAvailable)
      throw new BadRequestError(
        'The selected reservation date and time is not available...See reservation info in the restaurant details'
      );
    if (reservation.available < reservationCount!)
      throw new BadRequestError('Not enough tables to fulfill reservation');
    if (reservation.max < noOfGuests!.adults + noOfGuests!.children)
      throw new BadRequestError('Reservation max reached');
    if (!restaurant.details.children && noOfGuests!.children)
      throw new BadRequestError('Children are not allowed in the selected restaurant');
    return true;
  }
};
