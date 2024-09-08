import { User, UserModel } from '@models';
import { ICancellation, IFavProperties } from '@types';

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
  return UserModel.updateOne({ _id }, { deletedAt: Date.now() });
};

export const addFavouriteProperties = (_id: string, favouriteProperties: IFavProperties) => {
  return UserModel.updateOne({ _id }, { $addToSet: { favouriteProperties } });
};

export const removeFavouriteProperty = (_id: string, propertyId: string) => {
  return UserModel.updateOne({ _id }, { $pull: { favouriteProperties: { propertyId } } });
};

export const changeUserCancellationPolicy = (_id: string, cancellationPolicy: ICancellation) => {
  return UserModel.updateOne({ _id }, { cancellationPolicy });
};
