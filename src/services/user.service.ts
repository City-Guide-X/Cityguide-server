import { User, UserModel } from '@models';
import { IFavProperties, PropertyType } from '@types';

export const createUser = (input: Partial<User>) => {
  return UserModel.create({ ...input });
};

export const findUserById = (id: string) => {
  return UserModel.findById(id);
};

export const findUserByEmail = (email: string) => {
  return UserModel.findOne({ email });
};

export const updateUserInfo = (_id: string, options: Partial<User>) => {
  return UserModel.updateOne({ _id }, { ...options });
};

export const setUserRefreshToken = (_id: string, refreshToken: string | null) => {
  return UserModel.updateOne({ _id }, { refreshToken });
};

export const deleteUser = (_id: string) => {
  return UserModel.findOneAndDelete({ _id });
};

export const addFavouriteProperties = (_id: string, favouriteProperties: IFavProperties) => {
  return UserModel.updateOne({ _id }, { $addToSet: { favouriteProperties } });
};
