import { Parking } from './enums';

export interface IEvent {
  id: string;
  name: string;
  description: string;
  dates: { from: string; to: string }[];
  specialGuests: string[];
  price: number;
  imgUrl: string;
  availableTickets: number;
}

export interface IClubRules {
  dressCode: string[];
  minAge: number;
  parking: Parking;
  musicGenre: string[];
}
