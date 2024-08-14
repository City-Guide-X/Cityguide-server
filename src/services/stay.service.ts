import { AuthorizationError, BadRequestError, NotFoundError } from '@errors';
import { ReservationModel, ReviewModel, Stay, StayModel } from '@models';
import { IAccommodation, IReservationAccommodation } from '@types';

export const createStay = (input: Partial<Stay>) => {
  return StayModel.create({ ...input });
};

export const getAllStays = () => {
  return StayModel.find({});
};

export const getPartnerStays = (partner: string) => {
  return StayModel.find({ partner }).sort('-created');
};

export const getStayById = (_id: string) => {
  return StayModel.findById(_id).populate({
    path: 'partner',
    select: 'firstName lastName name email phoneNumber imgUrl',
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
    { $limit: 6 },
    { $project: { reservations: 0, reservationCount: 0 } },
  ]);
};

export const updateStay = (_id: string, partner: string, body: Partial<Stay>) => {
  return StayModel.updateOne({ _id, partner }, { $set: body });
};

export const deleteStay = async (_id: string, partner: string) => {
  const { deletedCount } = await StayModel.deleteOne({ _id, partner });
  if (!deletedCount) throw new NotFoundError('Stay not found');
  await Promise.all([ReservationModel.deleteMany({ property: _id }), ReviewModel.deleteMany({ property: _id })]);
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

export const updateAccommodationAvailability = (_id: string, accommodations: IReservationAccommodation[]) => {
  const bulkOps = accommodations.map(({ accommodationId, reservationCount }) => ({
    updateOne: {
      filter: { _id, 'accommodation.id': accommodationId },
      update: { $inc: { 'accommodation.$.available': -reservationCount } },
    },
  }));
  return StayModel.bulkWrite(bulkOps);
};
