import {
  EstablishmentStay,
  EstablishmentStayModel,
  NightLife,
  NightLifeModel,
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

export const getStayById = async (_id: string) => {
  const stay = await StayModel.findById(_id);
  if (stay?.partnerType === 'USER')
    return stay?.populate({ path: 'partner', select: 'name email phoneNumber imgUrl', model: 'User' });
  return stay?.populate({ path: 'partner', select: 'name email phoneNumber imgUrl', model: 'Establishment' });
};

export const updateAccommodationAvailability = async (_id: string, roomId: string, quantity: number) => {
  return StayModel.updateOne({ _id, 'accommodation.id': roomId }, { $inc: { 'accommodation.$.available': quantity } });
};

// Restaurants
export const createRestaurant = async (input: Partial<Restaurant>) => {
  return RestaurantModel.create({ ...input });
};

// NightLifes
export const createNightLife = async (input: Partial<NightLife>) => {
  return NightLifeModel.create({ ...input });
};

// General
export const isPropertyType = async (_id: string, type: PropertyType) => {
  if (type === PropertyType.STAY) return await StayModel.exists({ _id });
  if (type === PropertyType.RESTAURANT) return await RestaurantModel.exists({ _id });
  if (type === PropertyType.NIGHTLIFE) return await NightLifeModel.exists({ _id });
};
