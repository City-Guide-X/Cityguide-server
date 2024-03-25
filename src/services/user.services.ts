import { User, UserModel } from '@models';

export const createUser = (input: Partial<User>) => {
  return UserModel.create({ ...input });
};

export const findUserById = (id: string) => {
  return UserModel.findById(id);
};

export const findUserByEmail = (email: string) => {
  return UserModel.findOne({ email });
};

export const setUserRefreshToken = (_id: string, refreshToken: string | null) => {
  return UserModel.updateOne({ _id }, { refreshToken });
};
