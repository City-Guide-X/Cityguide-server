import { EstablishmentModel, UserModel } from '@models';
import { EntityType, IPayload } from '@types';
import { signJWT } from '@utils';
import { Types } from 'mongoose';

interface IToken extends IPayload {
  token?: 'access' | 'refresh' | 'both';
}

export const signTokens = ({ id, type, isPartner, token = 'both' }: IToken) => {
  let accessToken, refreshToken;
  if (token !== 'refresh') {
    accessToken = signJWT({ id, type, isPartner }, 'access', {
      expiresIn: process.env.ACCESSTOKENTTL,
    });
  }
  if (token !== 'access') {
    refreshToken = signJWT({ id, type, isPartner }, 'refresh', {
      expiresIn: process.env.REFRESHTOKENTTL,
    });
  }
  return { accessToken, refreshToken };
};

export const getAdminAnalytics = async (id: string, type: EntityType) => {
  const Model = type === EntityType.USER ? UserModel : EstablishmentModel;
  const analytics = await Model.aggregate([
    { $match: { _id: new Types.ObjectId(id) } },
    {
      $facet: {
        stays: [
          { $lookup: { from: 'stays', localField: '_id', foreignField: 'partner', as: 'stays' } },
          { $project: { stays: { $size: '$stays' } } },
        ],
        restaurants: [
          { $lookup: { from: 'restaurants', localField: '_id', foreignField: 'partner', as: 'restaurants' } },
          { $project: { restaurants: { $size: '$restaurants' } } },
        ],
        nightlifes: [
          { $lookup: { from: 'nightlifes', localField: '_id', foreignField: 'partner', as: 'nightlifes' } },
          { $project: { nightlifes: { $size: '$nightlifes' } } },
        ],
        reservation: [
          {
            $lookup: {
              from: 'reservations',
              localField: '_id',
              foreignField: 'partner',
              as: 'reservations',
              pipeline: [
                { $group: { _id: '$status', count: { $sum: 1 } } },
                { $project: { _id: 0, k: '$_id', v: '$count' } },
              ],
            },
          },
          { $project: { reservation: { $arrayToObject: '$reservations' } } },
        ],
        engagements: [
          { $lookup: { from: 'stays', localField: '_id', foreignField: 'partner', as: 'stays' } },
          { $lookup: { from: 'restaurants', localField: '_id', foreignField: 'partner', as: 'restaurants' } },
          { $lookup: { from: 'nightlifes', localField: '_id', foreignField: 'partner', as: 'nightlifes' } },
          {
            $lookup: {
              from: 'reservations',
              localField: '_id',
              foreignField: 'partner',
              as: 'reservations',
              pipeline: [{ $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } }],
            },
          },
          {
            $lookup: {
              from: 'reviews',
              let: { properties: { $concatArrays: ['$stays', '$restaurants', '$nightlifes'] } },
              pipeline: [
                { $match: { $expr: { $in: ['$property', '$$properties._id'] } } },
                { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
              ],
              as: 'reviews',
            },
          },
          {
            $project: {
              engagements: {
                $slice: [
                  {
                    $sortArray: { input: { $concatArrays: ['$reservations', '$reviews'] }, sortBy: { updatedAt: -1 } },
                  },
                  0,
                  6,
                ],
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        stays: { $arrayElemAt: ['$stays.stays', 0] },
        restaurants: { $arrayElemAt: ['$restaurants.restaurants', 0] },
        nightlifes: { $arrayElemAt: ['$nightlifes.nightlifes', 0] },
        reservation: { $arrayElemAt: ['$reservation.reservation', 0] },
        engagements: { $arrayElemAt: ['$engagements.engagements', 0] },
      },
    },
  ]);
  return analytics[0];
};
