import {
  Club,
  ClubModel,
  EstablishmentStay,
  EstablishmentStayModel,
  Restaurant,
  RestaurantModel,
  StayModel,
  UserStay,
  UserStayModel,
} from '@models';
import { PropertyType } from '@types';

// Stays
export const createUserStay = async (input: Partial<UserStay>) => {
  return UserStayModel.create({ ...input });
};

export const createEstablishmentStay = async (input: Partial<EstablishmentStay>) => {
  return EstablishmentStayModel.create({ ...input });
};

export const updateAccommodationAvailability = async (_id: string, roomId: string, quantity: number) => {
  return StayModel.updateOne({ _id, 'accommodation.id': roomId }, { $inc: { 'accommodation.$.available': quantity } });
};

// Restaurants
export const createRestaurant = async (input: Partial<Restaurant>) => {
  return RestaurantModel.create({ ...input });
};

// Clubs
export const createClub = async (input: Partial<Club>) => {
  return ClubModel.create({ ...input });
};

// General
export const isPropertyType = async (_id: string, type: PropertyType) => {
  if (type === PropertyType.STAY) return await StayModel.exists({ _id });
  if (type === PropertyType.RESTAURANT) return await RestaurantModel.exists({ _id });
  if (type === PropertyType.CLUB) return await ClubModel.exists({ _id });
};
