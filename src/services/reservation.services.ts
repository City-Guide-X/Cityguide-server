import { Reservation, ReservationModel } from '@models';

export const createReservation = (option: Partial<Reservation>, establishment: string, user: string) => {
  return ReservationModel.create({ ...option, establishment, user });
};

export const getAllUserReservations = (user: string) => {
  return ReservationModel.find({ user });
};

export const getAllEstablishmentReservations = (establishment: string) => {
  return ReservationModel.find({ establishment });
};

export const findReservationById = (_id: string) => {
  return ReservationModel.findOne({ _id });
};

export const updateReservation = (_id: string, option: Partial<Reservation>) => {
  return ReservationModel.updateOne({ _id }, { ...option });
};
