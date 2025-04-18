import { IAddress, ICustomAvailability } from './common.interface';
import {
  EntityType,
  HotelRating,
  ISPs,
  MaxDays,
  NightLifeType,
  Parking,
  PriceRange,
  PropertyType,
  Rating,
  Status,
  StayType,
  VTUType,
} from './enums';

// General
export interface ISocialLink {
  name: string;
  handle: string;
}
export interface IContact {
  email: string;
  phone: string;
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

export interface ICreateNightlife {
  partner: string;
  type: NightLifeType;
  name: string;
  summary: string;
  address: IAddress;
  avatar: string;
  images: string[];
  availability: ICustomAvailability[];
  rules: INightLifeRules;
  details: INightLifeDetails;
  contact: IContact;
}

// Restaurants
export interface IMenu {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  price?: number;
  category?: string[];
  dietaryProvisions?: string[];
}

export interface IRestaurantReservation {
  price: number;
  max: number;
  available: number;
}

export interface IRestaurantDetails {
  delivery: boolean;
  reservation?: IRestaurantReservation;
  amenities: string[];
  paymentOptions: string[];
  children: boolean;
}

export interface ICreateRestaurant {
  partner: string;
  name: string;
  summary: string;
  address: IAddress;
  avatar: string;
  images: string[];
  availability: ICustomAvailability[];
  priceRange: PriceRange;
  serviceStyle?: string[];
  cuisine?: string[];
  dietaryProvisions?: string[];
  menu: IMenu[];
  details: IRestaurantDetails;
  contact: IContact;
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
  extraBeds?: {
    cots: number;
    extraBeds: number;
  };
}

export interface IGroupedAmenities {
  [key: string]: string[];
}

export interface IBrandInfo {
  name?: string;
  logo?: string;
  rating?: HotelRating;
}

export interface IExtraInfo {
  property?: string;
  neighborhood?: {
    info?: string;
    locations?: { name: string; distance: string }[];
  };
  brand?: IBrandInfo;
}

export interface IOptionalService {
  title: string;
  description: string;
}

export interface ICreateStay {
  partner: string;
  partnerType: EntityType;
  type: StayType;
  name: string;
  summary: string;
  extraInfo?: IExtraInfo;
  address: IAddress;
  avatar: string;
  images: string[];
  amenities: string[];
  hotelRating?: HotelRating;
  rules: IStayRules;
  accommodation: IAccommodation[];
  maxDays?: MaxDays;
  language: string[];
  paymentMethods: string[];
  optionalServices?: IOptionalService[];
}

// Reservations
export interface IReservationAccommodation {
  accommodationId: string;
  reservationCount: number;
  noOfGuests: IGuests;
}

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
  status?: Status;
  checkInDay: Date;
  checkInTime: string;
  checkOutDay: Date;
  checkOutTime: string;
  accommodations?: IReservationAccommodation[];
  reservationCount: number;
  noOfGuests: IGuests;
  price: number;
  payReference: string;
  paymentAuth?: IPaymentAuth;
  useSavedCard?: boolean;
  saveCard?: boolean;
  payByProxy: boolean;
  currency: string;
  convertedPriceNGN?: number;
}

export interface IPaymentAuth {
  authorization_code: string;
  card_type: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  bin: string;
  bank: string;
  channel: string;
  signature: string;
  reusable: boolean;
  country_code: string;
  account_name: string | null;
  email: string;
}

// Review
export interface ICreateReview {
  property: string;
  propertyType: PropertyType;
  user: string;
  categoryRatings: ICategoryRating;
  message: string;
}

export interface ICategoryRating {
  [key: string]: Rating;
}

// VTU
export interface IVtuTransaction {
  user: any;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  network: ISPs;
  amount: number;
  dataValue?: string;
  type: VTUType;
  payReference: string;
  useSavedCard?: boolean;
  saveCard?: boolean;
  paymentAuth?: IPaymentAuth;
}
