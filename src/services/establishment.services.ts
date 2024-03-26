import { Establishment, EstablishmentModel } from '@models';
import { IRoomMenu } from '@types';

export const createEstablishment = (input: Partial<Establishment>) => {
  return EstablishmentModel.create({ ...input });
};

export const findEstablishmentById = (id: string) => {
  return EstablishmentModel.findById(id);
};

export const findEstablishmentByEmail = (email: string) => {
  return EstablishmentModel.findOne({ email });
};

export const updateEstablishmentInfo = (_id: string, fields: Partial<Establishment>) => {
  return EstablishmentModel.updateOne({ _id }, { ...fields });
};

export const setEstablishmentRefreshToken = (_id: string, refreshToken: string | null) => {
  return EstablishmentModel.updateOne({ _id }, { refreshToken });
};

export const addMenuItem = (_id: string, menu: IRoomMenu) => {
  return EstablishmentModel.updateOne({ _id }, { $addToSet: { menu } });
};

export const removeMenuItem = (_id: string, menuId: string) => {
  return EstablishmentModel.updateOne({ _id }, { $pull: { menu: { id: menuId } } });
};
