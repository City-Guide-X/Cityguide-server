import { Establishment, EstablishmentModel } from '@models';
import { ICancellation } from '@types';
import { Types } from 'mongoose';

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

export const updateEstablishmentRating = async (_id: string) => {
  const avgRating = await EstablishmentModel.aggregate([
    { $match: { _id: new Types.ObjectId(_id) } },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'establishment',
        as: 'reviews',
      },
    },
    { $unwind: '$reviews' },
    {
      $group: {
        _id: 0,
        avgRating: { $avg: '$reviews.rating' },
      },
    },
  ]);
  return EstablishmentModel.updateOne({ _id }, { rating: avgRating[0].avgRating.toFixed(1) });
};

export const changeEstablishmentCancellationPolicy = (_id: string, cancellationPolicy: ICancellation) => {
  return EstablishmentModel.updateOne({ _id }, { cancellationPolicy });
};

export const deleteEstablishment = (_id: string) => {
  return EstablishmentModel.findOneAndDelete({ _id });
};
