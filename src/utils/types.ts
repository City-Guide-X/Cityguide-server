/* eslint-disable no-unused-vars */

import { Establishment, Reservation, Review, User } from '@models';
import { Request } from 'express';

// ENUMS
export enum EstablishmentType {
  STAY = 'Stay',
  RESTAURANT = 'Restaurant',
  CLUB = 'Club',
}

export enum Status {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
}

export enum Rating {
  ONE = 1,
  TWO,
  THREE,
  FOUR,
  FIVE,
}

// INTERFACES
export interface IRoomMenu {
  id: string;
  name: string;
  desc: string;
  imgUrl: string;
  price: number;
}

export interface IAddress {
  name: string;
  locationId: string;
  geoLocation: { lat: number; lng: number };
  extraDetails?: string;
}

export interface IAvailability {
  day: string;
  from: string;
  to: string;
}

export interface IPayload {
  id: string;
  type: 'USER' | 'ESTABLISHMENT';
}

export interface IEmail {
  template: string;
  to: string;
  locals: object;
}

export interface IReview {
  id: string;
  user: string;
  rating: Rating;
  message: string;
  createdAt: Date;
}

export interface IMenuImg {
  id: string;
  imgUrl: string;
}

export interface ClientToServerEvents {
  add_user: (userId: string) => void;
  add_establishment: (establishmentId: string) => void;
  create_reservation: (establishmentId: string, reservation: Partial<Reservation>) => void;
  update_reservation: (to: string, data: { reservationId: string; status: Status }) => void;
  create_review: (data: { establishmentId: string; review: Partial<Review> }) => void;
  delete_review: (data: { establishmentId: string; reviewId: string }) => void;
  update_establishment: (establishment: Partial<Establishment>) => void;
}
export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  new_reservation: (reservation: Partial<Reservation>) => void;
  updated_reservation: (data: { reservationId: string; status: Status }) => void;
  new_review: (data: { establishmentId: string; review: Partial<Review> }) => void;
  deleted_review: (data: { establishmentId: string; reviewId: string }) => void;
  updated_establishment: (establishment: Partial<Establishment>) => void;
}
export interface InterServerEvents {
  ping: () => void;
}
export interface SocketData {
  name: string;
  age: number;
}
