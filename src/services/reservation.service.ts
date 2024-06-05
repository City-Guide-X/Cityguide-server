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
  if (isFuture(checkInDay!, checkInTime!)) return 'The reservation date must be in the future';
  if (propertyType === PropertyType.STAY) {
    const stay = await StayModel.findById(property);
    if (!stay) return 'Invalid Stay ID';
    if (dayjs(checkOutDay).diff(checkInDay, 'd') > stay.maxDays) return 'The reservation exceeds the maximum stay';
    const room = stay.accommodation.find((room) => room.id === roomId);
    if (!room) return 'The provided room ID is not valid';
    if (room.available < reservationCount!) return 'The provided quantity exceeds the available rooms';
    if (!room.children && noOfGuests!.children) return 'Children are not allowed in the selected accommodation';
    if (noOfGuests!.adults + noOfGuests!.children > room.maxGuests)
      return 'The provided number of guests exceed the room capacity';
    return null;
  }
  if (propertyType === PropertyType.RESTAURANT) {
    const restaurant = await RestaurantModel.findById(property);
    if (!restaurant) return 'Invalid Restaurant ID';
    const isAvailable = [
      restaurant.availability
        .map(({ day, from, to }) => isValidDate(checkInDay!, checkInTime!, day, from, to))
        .some(Boolean),
      restaurant.availability
        .map(({ day, from, to }) => isValidDate(checkOutDay!, checkOutTime!, day, from, to))
        .some(Boolean),
    ].every(Boolean);
    if (!isAvailable)
      return 'The selected reservation date and time is not available...See reservation info in the restaurant details';
    if (!restaurant.details.reservation) return 'This Restaurant does not accept reservations';
    if (restaurant.details.reservation < reservationCount!) return 'Reservation max reached';
    if (!restaurant.details.children && noOfGuests!.children)
      return 'Children are not allowed in the selected restaurant';
    if (restaurant.details.reservation < noOfGuests!.adults + noOfGuests!.children) return 'Reservation max reached';
    return null;
  }
  if (propertyType === PropertyType.NIGHTLIFE) {
    const nightLife = await NightLifeModel.findById(property);
    if (!nightLife) return 'Invalid NightLife ID';
    return null;
  }
};
