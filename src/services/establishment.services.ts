import { Establishment, EstablishmentModel } from '@models';

export const createEstablishment = (input: Partial<Establishment>) => {
  return EstablishmentModel.create({ ...input });
};

export const findEstablishmentByEmail = (email: string) => {
  return EstablishmentModel.findOne({ email });
};

export const setEstablishmentRefreshToken = (
  _id: string,
  refreshToken: string
) => {
  return EstablishmentModel.updateOne({ _id }, { refreshToken });
};
