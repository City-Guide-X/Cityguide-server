import { BadRequestError } from '@errors';
import {
  NightLifeModel,
  NightLifeReservation,
  NightLifeReservationModel,
  Reservation,
  ReservationModel,
  RestaurantModel,
  RestaurantReservation,
  RestaurantReservationModel,
  StayModel,
  StayReservation,
  StayReservationModel,
} from '@models';
import { PropertyType } from '@types';
import { isFuture, isValidDate } from '@utils';
import dayjs from 'dayjs';
import { Types } from 'mongoose';

export const reserveStay = (input: Partial<StayReservation>) => {
  return StayReservationModel.create({ ...input });
};

export const reserveRestaurant = (input: Partial<RestaurantReservation>) => {
  return RestaurantReservationModel.create({ ...input });
};

export const reserveNightLife = (input: Partial<NightLifeReservation>) => {
  return NightLifeReservationModel.create({ ...input });
};

export const createReservation = (option: Partial<Reservation>, establishment: string, user: string) => {
  return ReservationModel.create({ ...option, establishment, user });
};

export const getAllUserReservations = async (id: string) => {
  const res = (await ReservationModel.find().populate('property', 'partnerType partner', 'Stay')).filter(
    (res: any) => res.property?.partner?.toString() === id
  );
  return res;
};

export const getAllEstablishmentReservations = async (id: string) => {
  const res = await Promise.all([
    ...(
      await StayReservationModel.find().populate('property', 'partner partnerType name avatar', 'Stay')
    ).filter((res: any) => res.property?.partner?.toString() === id),
    ...(
      await RestaurantReservationModel.find().populate('property', 'establishment name avatar', 'Restaurant')
    ).filter((res: any) => res.property?.establishment?.toString() === id),
    ...(
      await NightLifeReservationModel.find().populate('property', 'establishment name avatar', 'NightLife')
    ).filter((res: any) => res.property?.establishment?.toString() === id),
  ]);
  return res;
};

export const findReservationById = (_id: string) => {
  return ReservationModel.findOne({ _id });
};

export const updateReservation = (_id: string, option: Partial<Reservation>) => {
  return ReservationModel.updateOne({ _id }, { ...option });
};

export const reservationAnalytics = (
  ownerId: string,
  ownerType: 'USER' | 'ESTABLISHMENT',
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
        ...(property && { property: new Types.ObjectId(property) }),
        ...(propertyType && { propertyType }),
      },
    },
    ownerType === 'USER'
      ? {
          $lookup: {
            from: 'stays',
            localField: 'property',
            foreignField: '_id',
            as: 'stay',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  partner: 1,
                },
              },
            ],
          },
        }
      : {
          $lookup: {
            from: 'restaurants',
            localField: 'property',
            foreignField: '_id',
            as: 'restaurant',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  establishment: 1,
                },
              },
            ],
          },
        },
    {
      $match: {
        $or: [{ 'stay.0.partner': { $ne: ownerId } }, { 'restaurant.0.establishment': { $ne: ownerId } }],
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
  roomId,
  checkInDay,
  checkInTime,
  checkOutDay,
  checkOutTime,
  noOfGuests,
}: Partial<StayReservation>) => {
  if (isFuture(checkInDay!, checkInTime!)) throw new BadRequestError('The reservation date must be in the future');
  if (propertyType === PropertyType.STAY) {
    const stay = await StayModel.findById(property);
    if (!stay) throw new BadRequestError('Invalid Stay ID');
    if (dayjs(checkOutDay).diff(checkInDay, 'd') > stay.maxDays)
      throw new BadRequestError('The reservation exceeds the maximum stay');
    const room = stay.accommodation.find((room) => room.id === roomId);
    if (!room) throw new BadRequestError('The provided room ID is not valid');
    if (room.available < reservationCount!)
      throw new BadRequestError('The provided quantity exceeds the available rooms');
    if (!room.children && noOfGuests!.children)
      throw new BadRequestError('Children are not allowed in the selected accommodation');
    if (noOfGuests!.adults + noOfGuests!.children > room.maxGuests)
      throw new BadRequestError('The provided number of guests exceed the room capacity');
    return true;
  }
  if (propertyType === PropertyType.RESTAURANT) {
    const restaurant = await RestaurantModel.findById(property);
    if (!restaurant) throw new BadRequestError('Invalid Restaurant ID');
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
    if (!restaurant.details.reservation) throw new BadRequestError('This Restaurant does not accept reservations');
    if (restaurant.details.reservation < reservationCount!) throw new BadRequestError('Reservation max reached');
    if (!restaurant.details.children && noOfGuests!.children)
      throw new BadRequestError('Children are not allowed in the selected restaurant');
    if (restaurant.details.reservation < noOfGuests!.adults + noOfGuests!.children)
      throw new BadRequestError('Reservation max reached');
    return true;
  }
  if (propertyType === PropertyType.NIGHTLIFE) {
    const nightLife = await NightLifeModel.findById(property);
    if (!nightLife) throw new BadRequestError('Invalid NightLife ID');
    return true;
  }
};
