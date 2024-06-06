import { AuthorizationError, BadRequestError } from '@errors';
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

export const addAccommodation = async (_id: string, partner: string, body: UserStay['accommodation']) => {
  const stay = (await StayModel.findById(_id)) as UserStay;
  if (stay.partner.toString() !== partner) throw new AuthorizationError();
  return StayModel.updateOne({ _id }, { $addToSet: { accommodation: { $each: body } } });
};

export const updateAccommodation = async (
  _id: string,
  partner: string,
  roomId: string,
  body: Partial<UserStay['accommodation'][0]>
) => {
  const stay = (await StayModel.findById(_id)) as UserStay;
  if (stay.partner.toString() !== partner) throw new AuthorizationError();
  if (!stay.accommodation.find((room) => room.id === roomId)) throw new BadRequestError('Accommodation not found');
  return StayModel.updateOne({ _id, 'accommodation.id': roomId }, { $set: { 'accommodation.$': body } });
};

export const removeAccommodation = async (_id: string, partner: string, roomId: string) => {
  const stay = (await StayModel.findById(_id)) as UserStay;
  if (stay.partner.toString() !== partner) throw new AuthorizationError();
  if (!stay.accommodation.find((room) => room.id === roomId)) throw new BadRequestError('Accommodation not found');
  return StayModel.updateOne({ _id }, { $pull: { accommodation: { id: roomId } } });
};

export const updateAccommodationAvailability = async (_id: string, roomId: string, quantity: number) => {
  return StayModel.updateOne({ _id, 'accommodation.id': roomId }, { $inc: { 'accommodation.$.available': quantity } });
};

// Restaurants
export const createRestaurant = async (input: Partial<Restaurant>) => {
  return RestaurantModel.create({ ...input });
};

export const getRestaurantById = async (_id: string) => {
  return RestaurantModel.findById(_id).populate('establishment', 'name email phoneNumber imgUrl', 'Establishment');
};

// NightLifes
export const createNightLife = async (input: Partial<NightLife>) => {
  return NightLifeModel.create({ ...input });
};

export const getNightLifeById = async (_id: string) => {
  return NightLifeModel.findById(_id).populate('establishment', 'name email phoneNumber imgUrl', 'Establishment');
};

// General
export const isPropertyType = async (_id: string, type: PropertyType) => {
  if (type === PropertyType.STAY) return await StayModel.exists({ _id });
  if (type === PropertyType.RESTAURANT) return await RestaurantModel.exists({ _id });
  if (type === PropertyType.NIGHTLIFE) return await NightLifeModel.exists({ _id });
};
