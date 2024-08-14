import { EntityType, Parking, PropertyType, Status } from './enums';

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

export interface ICancellation {
  daysFromReservation: number;
  percentRefundable: number;
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
  category?: string[];
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
export interface IFurniture {
  type: string;
  count: number;
}

export interface IBreakfastInfo {
  price: number;
  options: string[];
}

export interface IAccommodation {
  id: string;
  name: string;
  description?: string;
  images: string[];
  rooms: { name: string; furnitures: IFurniture[] }[];
  maxGuests: number;
  bathrooms: number;
  children: boolean;
  infants: boolean;
  breakfast?: IBreakfastInfo;
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
  neighborhood?: {
    info?: string;
    locations?: { name: string; distance: string }[];
  };
}

// Reservations
export interface IReservation {
  property: any;
  propertyType: PropertyType;
  user: any;
  partner: any;
  partnerType: EntityType;
  isAgent?: boolean;
  guestFullName?: string;
  guestEmail?: string;
  requests?: string[];
  status: Status;
  checkInDay: Date;
  checkInTime: string;
  checkOutDay: Date;
  checkOutTime: string;
  roomId?: string;
  reservationCount: number;
  noOfGuests: IGuests;
  price?: number;
}
