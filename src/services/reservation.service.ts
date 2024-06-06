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

export const getAllUserReservations = (user: string) => {
  return ReservationModel.find({ user }).sort('updatedAt');
};

export const getAllEstablishmentReservations = (establishment: string) => {
  return ReservationModel.find({ establishment }).sort('updatedAt');
};

export const findReservationById = (_id: string) => {
  return ReservationModel.findOne({ _id });
};

export const updateReservation = (_id: string, option: Partial<Reservation>) => {
  return ReservationModel.updateOne({ _id }, { ...option });
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
