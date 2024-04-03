import { Establishment, EstablishmentModel } from '@models';
import { IMenuImg, IRoomMenu } from '@types';
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

export const addMenuItem = (_id: string, menu: IRoomMenu) => {
  return EstablishmentModel.updateOne({ _id }, { $addToSet: { menu } });
};

export const removeMenuItem = (_id: string, menuIds: string[]) => {
  return EstablishmentModel.updateOne({ _id }, { $pull: { menu: { id: { $in: menuIds } } } });
};

export const addRoom = (_id: string, rooms: IRoomMenu) => {
  return EstablishmentModel.updateOne({ _id }, { $addToSet: { rooms } });
};

export const removeRoom = (_id: string, roomIds: string[]) => {
  return EstablishmentModel.updateOne({ _id }, { $pull: { rooms: { id: { $in: roomIds } } } });
};

export const addMenuImg = (_id: string, menuImgs: IMenuImg[]) => {
  return EstablishmentModel.updateOne({ _id }, { $addToSet: { menuImgs: { $each: menuImgs } } });
};

export const removeMenuImg = (_id: string, menuImgIds: string[]) => {
  return EstablishmentModel.updateOne({ _id }, { $pull: { menuImgs: { id: { $in: menuImgIds } } } });
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

export const deleteEstablishment = (_id: string) => {
  return EstablishmentModel.findOneAndDelete({ _id });
};
