import {
  EstablishmentStay,
  EstablishmentStayModel,
  Restaurant,
  RestaurantModel,
  UserStay,
  UserStayModel,
} from '@models';

// Stays
export const createUserStay = async (input: Partial<UserStay>) => {
  return UserStayModel.create({ ...input });
};

export const createEstablishmentStay = async (input: Partial<EstablishmentStay>) => {
  return EstablishmentStayModel.create({ ...input });
};

// Restaurants
export const createRestaurant = async (input: Partial<Restaurant>) => {
  return RestaurantModel.create({ ...input });
};
