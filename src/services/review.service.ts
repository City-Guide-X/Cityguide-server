import { BadRequestError } from '@errors';
import { NightLifeModel, RestaurantModel, ReviewModel, StayModel } from '@models';
import { ICreateReview, PropertyType } from '@types';
import dayjs from 'dayjs';
import { Types } from 'mongoose';

export const createReview = (input: ICreateReview) => {
  return ReviewModel.create({ ...input });
};

export const deleteReview = (_id: string, user: string) => {
  return ReviewModel.findOneAndUpdate({ _id, user }, { deletedAt: dayjs().toDate() });
};

export const getReviews = (property: string) => {
  return ReviewModel.find({ property });
};

export const canReview = async (property: string, type: PropertyType, user: string) => {
  if (type === PropertyType.STAY) {
    const isValid = await StayModel.exists({ _id: property });
    if (!isValid) throw new BadRequestError('Invalid Stay ID');
    const result = await StayModel.aggregate([
      { $match: { _id: new Types.ObjectId(property) } },
      {
        $lookup: {
          from: 'reservations',
          localField: '_id',
          foreignField: 'property',
          as: 'reservations',
        },
      },
      { $unwind: '$reservations' },
      { $match: { 'reservations.user': new Types.ObjectId(user) } },
      { $count: 'count' },
      { $addFields: { canReview: { $toBool: '$count' } } },
      { $project: { canReview: 1 } },
    ]);
    return result[0].canReview;
  }
  if (type === PropertyType.RESTAURANT) {
    const isValid = await RestaurantModel.exists({ _id: property });
    if (!isValid) throw new BadRequestError('Invalid Restaurant ID');
    const result = await RestaurantModel.aggregate([
      { $match: { _id: new Types.ObjectId(property) } },
      {
        $lookup: {
          from: 'reservations',
          let: { propertyId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$property', '$$propertyId'] }, { $eq: ['$user', new Types.ObjectId(user)] }],
                },
              },
            },
          ],
          as: 'reservations',
        },
      },
      {
        $project: {
          _id: 0,
          canReview: {
            $or: [
              { $gt: [{ $size: '$reservations' }, 0] },
              { $cond: [{ $gt: ['$details.reservation', null] }, false, true] },
            ],
          },
        },
      },
    ]);
    return result[0].canReview;
  }
  const isValid = await NightLifeModel.exists({ _id: property });
  if (!isValid) throw new BadRequestError('Invalid NightLife ID');
  return true;
};
