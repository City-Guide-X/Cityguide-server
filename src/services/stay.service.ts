import { AuthorizationError, BadRequestError, NotFoundError } from '@errors';
import { Stay, StayModel } from '@models';
import { IAccommodation, ICreateStay, IReservationAccommodation } from '@types';
import dayjs from 'dayjs';

export const createStay = (input: ICreateStay) => {
  return StayModel.create({ ...input });
};

export const getAllStays = () => {
  return StayModel.find({});
};

export const getPartnerStays = (partner: string) => {
  return StayModel.find({ partner }).sort('-updatedAt');
};

export const getStayById = (_id: string) => {
  return StayModel.findById(_id).populate({
    path: 'partner',
    select: 'firstName lastName name email phoneNumber imgUrl cancellationPolicy',
  });
};

export const getTrendingStays = () => {
  return StayModel.aggregate([
    {
      $lookup: {
        from: 'reservations',
        localField: '_id',
        foreignField: 'property',
        as: 'reservations',
      },
    },
    { $addFields: { reservationCount: { $size: '$reservations' } } },
    { $sort: { reservationCount: -1 } },
    { $limit: 10 },
    { $project: { reservations: 0, reservationCount: 0 } },
  ]);
};

export const updateStay = (_id: string, partner: string, body: Partial<Stay>) => {
  return StayModel.updateOne({ _id, partner }, { $set: body });
};

export const deleteStay = async (_id: string, partner: string) => {
  return StayModel.updateOne({ _id, partner }, { deletedAt: dayjs().toDate() });
};

export const addAccommodation = (_id: string, partner: string, body: IAccommodation[]) => {
  return StayModel.updateOne({ _id, partner }, { $addToSet: { accommodation: { $each: body } } });
};

export const updateAccommodation = async (
  _id: string,
  partner: string,
  roomId: string,
  body: Partial<IAccommodation>
) => {
  const { matchedCount, modifiedCount } = await StayModel.updateOne(
    { _id, partner, 'accommodation.id': roomId },
    { $set: { 'accommodation.$': body } }
  );
  if (!matchedCount) {
    const stay = await StayModel.findById(_id);
    if (stay?.partner.toString() !== partner) throw new AuthorizationError();
    if (!stay.accommodation.find((a) => a.id === roomId)) throw new BadRequestError('Accommodation not found');
    throw new NotFoundError('Stay not found');
  }
  if (!modifiedCount) throw new NotFoundError('Stay not found');
};

export const removeAccommodation = async (_id: string, partner: string, roomId: string) => {
  const { matchedCount, modifiedCount } = await StayModel.updateOne(
    { _id, partner, 'accommodation.id': roomId },
    { $pull: { accommodation: { id: roomId } } }
  );
  if (!matchedCount) {
    const stay = await StayModel.findById(_id);
    if (stay?.partner.toString() !== partner) throw new AuthorizationError();
    if (!stay.accommodation.find((a) => a.id === roomId)) throw new BadRequestError('Accommodation not found');
    throw new BadRequestError('Update failed');
  }
  if (!modifiedCount) throw new BadRequestError();
};

export const updateAccommodationAvailability = (
  _id: string,
  accommodations: IReservationAccommodation[],
  release?: boolean
) => {
  const bulkOps = accommodations.map(({ accommodationId, reservationCount }) => ({
    updateOne: {
      filter: { _id, 'accommodation.id': accommodationId },
      update: { $inc: { 'accommodation.$.available': release ? reservationCount : -reservationCount } },
    },
  }));
  return StayModel.bulkWrite(bulkOps);
};

export const searchStay = async (
  checkin?: Date,
  checkout?: Date,
  children?: boolean,
  guests?: number,
  count: number = 1
) => {
  const dayDiff = dayjs(checkout).diff(dayjs(checkin), 'd');
  return StayModel.aggregate([
    {
      $match: {
        ...(checkin && checkout && { maxDays: { $gte: dayDiff } }),
      },
    },
    {
      $addFields: {
        childrenAllowed: {
          $anyElementTrue: {
            $map: {
              input: '$accommodation',
              as: 'acc',
              in: {
                $and: [
                  { $eq: ['$$acc.children', true] },
                  { $eq: ['$$acc.infants', true] },
                  { $gte: ['$$acc.available', 1] },
                ],
              },
            },
          },
        },
        availableRooms: {
          $sum: '$accommodation.available',
        },
        maxGuests: {
          $max: '$accommodation.maxGuests',
        },
      },
    },
    {
      $match: {
        ...(children && { childrenAllowed: children }),
        ...(count && { availableRooms: { $gte: +count } }),
        ...(guests && { maxGuests: { $gte: +guests } }),
      },
    },
    {
      $lookup: {
        from: 'establishments',
        localField: 'partner',
        foreignField: '_id',
        as: 'est',
        pipeline: [
          {
            $project: { name: 1, phoneNumber: 1, email: 1, imgUrl: 1, cancellationPolicy: 1 },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'partner',
        foreignField: '_id',
        as: 'user',
        pipeline: [
          {
            $project: { firstName: 1, lastName: 1, phoneNumber: 1, email: 1, imgUrl: 1, cancellationPolicy: 1 },
          },
        ],
      },
    },
    {
      $addFields: {
        partner: {
          $arrayElemAt: [{ $concatArrays: ['$user', '$est'] }, 0],
        },
      },
    },
    {
      $project: { childrenAllowed: 0, availableRooms: 0, maxGuests: 0, est: 0, user: 0 },
    },
  ]);
};
