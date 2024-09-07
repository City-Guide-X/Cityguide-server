import { NotFoundError } from '@errors';
import { NightLife, NightLifeModel, ReservationModel, ReviewModel } from '@models';
import { DayOfWeek } from '@types';

export const createNightLife = (input: Partial<NightLife>) => {
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
  return NightLifeModel.aggregate([{ $sort: { reviewCount: -1, rating: -1 } }, { $limit: 10 }]);
};

export const updateNightLife = (_id: string, partner: string, body: Partial<NightLife>) => {
  return NightLifeModel.updateOne({ _id, partner }, { $set: body });
};

export const deleteNightLife = async (_id: string, partner: string) => {
  const { deletedCount } = await NightLifeModel.deleteOne({ _id, partner });
  if (!deletedCount) throw new NotFoundError('NightLife not found');
  await Promise.all([ReviewModel.deleteMany({ property: _id }), ReservationModel.deleteMany({ property: _id })]);
};

export const searchNightlife = async (day?: DayOfWeek, time?: string, minAge?: number) => {
  return NightLifeModel.aggregate([
    {
      $match: {
        ...(minAge && { 'rules.minAge': { $gte: +minAge } }),
        ...(time &&
          day && {
            $expr: {
              $anyElementTrue: {
                $map: {
                  input: '$availability',
                  as: 'avail',
                  in: {
                    $let: {
                      vars: {
                        fromTime: { $toDate: { $concat: ['2000-01-01T', '$$avail.from', ':00Z'] } },
                        toTime: { $toDate: { $concat: ['2000-01-01T', '$$avail.to', ':00Z'] } },
                        queryTime: { $toDate: { $concat: ['2000-01-01T', time, ':00Z'] } },
                        isOvernight: { $gt: ['$$avail.from', '$$avail.to'] },
                      },
                      in: {
                        $and: [
                          { $eq: ['$$avail.day', day] },
                          {
                            $cond: {
                              if: '$$isOvernight',
                              then: {
                                $and: [
                                  { $gte: ['$$queryTime', '$$fromTime'] },
                                  {
                                    $lte: [
                                      {
                                        $dateAdd: {
                                          startDate: '$$queryTime',
                                          unit: 'hour',
                                          amount: 1,
                                        },
                                      },
                                      {
                                        $dateAdd: {
                                          startDate: '$$toTime',
                                          unit: 'day',
                                          amount: 1,
                                        },
                                      },
                                    ],
                                  },
                                ],
                              },
                              else: {
                                $and: [
                                  { $gte: ['$$queryTime', '$$fromTime'] },
                                  {
                                    $lte: [
                                      {
                                        $dateAdd: {
                                          startDate: '$$queryTime',
                                          unit: 'hour',
                                          amount: 1,
                                        },
                                      },
                                      '$$toTime',
                                    ],
                                  },
                                ],
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          }),
      },
    },
  ]);
};
