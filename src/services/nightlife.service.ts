import { NightLife, NightLifeModel } from '@models';
import { DayOfWeek, ICreateNightlife } from '@types';
import dayjs from 'dayjs';

export const createNightLife = (input: ICreateNightlife) => {
  return NightLifeModel.create({ ...input });
};

export const getAllNightlife = () => {
  return NightLifeModel.find({});
};

export const getPartnerNightlifes = (partner: string) => {
  return NightLifeModel.find({ partner }).sort('-updatedAt');
};

export const getNightLifeById = (_id: string) => {
  return NightLifeModel.findById(_id).populate({
    path: 'partner',
    select: 'name email phoneNumber imgUrl',
    model: 'Establishment',
  });
};

export const getTrendingNightlifes = () => {
  return NightLifeModel.aggregate([{ $sort: { reviewCount: -1, rating: -1 } }, { $limit: 12 }]);
};

export const updateNightLife = (_id: string, partner: string, body: Partial<NightLife>) => {
  return NightLifeModel.updateOne({ _id, partner }, { $set: body });
};

export const deleteNightLife = (_id: string, partner: string) => {
  return NightLifeModel.updateOne({ _id, partner }, { deletedAt: dayjs().toDate() });
};

export const searchNightlife = async (day?: DayOfWeek, time?: string, minAge?: number) => {
  return NightLifeModel.aggregate([
    {
      $match: {
        ...(minAge && { 'rules.minAge': { $gte: +minAge } }),
        ...(day &&
          time && {
            $expr: {
              $anyElementTrue: {
                $map: {
                  input: '$availability',
                  as: 'avail',
                  in: {
                    $and: [
                      { $eq: ['$$avail.day', day] },
                      {
                        $or: [
                          {
                            $gte: [
                              { $toDate: { $concat: ['2000-01-01T', time, ':00Z'] } },
                              { $toDate: { $concat: ['2000-01-01T', '$$avail.from', ':00Z'] } },
                            ],
                          },
                          {
                            $lte: [
                              { $toDate: { $concat: ['2000-01-01T', time, ':00Z'] } },
                              { $toDate: { $concat: ['2000-01-01T', '$$avail.to', ':00Z'] } },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          }),
      },
    },
  ]);
};
