import { Establishment, EstablishmentModel } from '@models';

export const createEstablishment = (input: Partial<Establishment>) => {
  return EstablishmentModel.create({ ...input });
};

export const findEstablishmentById = (id: string) => {
  return EstablishmentModel.findById(id);
};

export const findEstablishmentByEmail = (email: string) => {
  return EstablishmentModel.findOne({ email });
};

export const setEstablishmentRefreshToken = (_id: string, refreshToken: string | null) => {
  return EstablishmentModel.updateOne({ _id }, { refreshToken });
};
