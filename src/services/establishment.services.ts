import { Establishment, EstablishmentModel } from '@models';
import { IRoomMenu } from '@types';

export const createEstablishment = (input: Partial<Establishment>) => {
  return EstablishmentModel.create({ ...input });
};

export const getAllEstablishments = () => EstablishmentModel.find();

export const findEstablishmentById = (id: string) => {
  return EstablishmentModel.findById(id);
};

export const findEstablishmentByEmail = (email: string) => {
  return EstablishmentModel.findOne({ email });
};

export const findEstablishmentByType = (types: string[]) => {
  return EstablishmentModel.find({ type: { $in: types } });
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

export const addRoom = (_id: string, rooms: IRoomMenu) => {
  return EstablishmentModel.updateOne({ _id }, { $addToSet: { rooms } });
};

export const removeRoom = (_id: string, roomId: string) => {
  return EstablishmentModel.updateOne({ _id }, { $pull: { rooms: { id: roomId } } });
};
