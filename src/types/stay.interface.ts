import { Parking } from './enums';

// Miscellaneous interfaces
export interface IBed {
  id: string;
  type: string;
  count: number;
}

// Main interfaces
export interface IAccommodation {
  id: string;
  name: string;
  description?: string;
  rooms: { name: string; beds: IBed[] }[];
  maxGuests: number;
  bathrooms: number;
  children: boolean;
  infants: boolean;
  breakfast: boolean;
  parking: Parking;
  size?: number;
  noAvailable: number;
  amenities?: string[];
  price: number;
}

export interface IStayRules {
  checkIn: string;
  checkOut: string;
  smoking: boolean;
  pets: boolean;
  parties: boolean;
}

export interface IExtraInfo {
  host?: { name: string; info: string };
  property?: string;
  neighbourhood?: string;
}
