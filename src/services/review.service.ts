import { BadRequestError } from '@errors';
import { NightLifeModel, RestaurantModel, ReviewModel, StayModel } from '@models';
import { ICategoryRating, ICreateReview, PropertyType } from '@types';
import dayjs from 'dayjs';
import { ClientSession, Types } from 'mongoose';

export const createReview = async (input: ICreateReview, session?: ClientSession) => {
  const [review] = await ReviewModel.create([{ ...input }], { session });
  return review;
};

export const deleteReview = (_id: string, user: string, session?: ClientSession) => {
  return ReviewModel.findOneAndUpdate({ _id, user }, { deletedAt: dayjs().toDate() }, { session });
};

export const getReviews = (property: string) => {
  return ReviewModel.find({ property }).populate({
    path: 'user',
    select: 'firstName lastName email phoneNumber imgUrl',
    model: 'User',
  });
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

const modelMap = {
  [PropertyType.STAY]: StayModel,
  [PropertyType.RESTAURANT]: RestaurantModel,
  [PropertyType.NIGHTLIFE]: NightLifeModel,
};
export const updatePropertyReviewDetail = async (property: string, type: PropertyType, session?: ClientSession) => {
  const [result] = await ReviewModel.aggregate(
    [
      {
        $match: {
          property: new Types.ObjectId(property),
          propertyType: type,
          deletedAt: null,
        },
      },
      {
        $group: {
          _id: null,
          rating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
          categoryRatings: { $push: '$categoryRatings' },
        },
      },
      {
        $project: {
          _id: 0,
          rating: { $round: ['$rating', 1] },
          reviewCount: 1,
          categoryRatings: 1,
        },
      },
    ],
    { session }
  );
  if (!result) return;
  const { categoryRatings, reviewCount, rating } = result;
  const summedRatings = categoryRatings.reduce((acc: ICategoryRating, curr: ICategoryRating) => {
    Object.keys(curr).forEach((category) => {
      acc[category] = (acc[category] || 0) + curr[category];
    });
    return acc;
  }, {});
  const averagedCategories = Object.fromEntries(
    Object.entries<number>(summedRatings).map(([key, value]) => [key, +(value / reviewCount).toFixed(1)])
  );
  const updateObj = { reviewCount, rating, categoryRatings: averagedCategories };
  const Model = modelMap[type];
  await Model.updateOne({ _id: property }, { $set: updateObj });
};
