/* eslint-disable no-unused-vars */
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
