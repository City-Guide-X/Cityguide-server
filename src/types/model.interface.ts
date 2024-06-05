import { Parking } from './enums';

// General
export interface ISocialLink {
  name: string;
  handle: string;
}

export interface IContact {
  email: string;
  phone?: string;
  socialMedia?: ISocialLink[];
}

export interface IGuests {
  adults: number;
  children: number;
}

// NightLife
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

export interface INightLifeRules {
  minAge: number;
  parking: Parking;
  dressCode?: string[];
  musicGenre?: string[];
}

export interface INightLifeDetails {
  entryFee?: number;
  paymentOptions: string[];
  amenities: string[];
}

// Restaurants
export interface IMenu {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  price?: number;
  category?: string;
  dietaryRestrictions?: string[];
}

export interface IRestaurantDetails {
  delivery: boolean;
  reservation?: number;
  amenities?: string[];
  paymentOptions?: string[];
  children: boolean;
}

// Stays
export interface IBed {
  id: string;
  type: string;
  count: number;
}

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
  initialAvailable: number;
  available: number;
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
