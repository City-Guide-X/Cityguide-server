import { User, UserModel } from '@models';

export const createUser = (input: Partial<User>) => {
  return UserModel.create({ ...input });
};

export const findUserByEmail = (email: string) => {
  return UserModel.findOne({ email });
};

export const setUserRefreshToken = (_id: string, refreshToken: string) => {
  return UserModel.updateOne({ _id }, { refreshToken });
};
