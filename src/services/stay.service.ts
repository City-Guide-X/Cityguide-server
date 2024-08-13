import { AuthorizationError, BadRequestError, NotFoundError } from '@errors';
import {
  EstablishmentStay,
  EstablishmentStayModel,
  ReservationModel,
  ReviewModel,
  StayModel,
  UserStay,
  UserStayModel,
} from '@models';
import { EntityType } from '@types';

export const createUserStay = async (input: Partial<UserStay>) => {
  return UserStayModel.create({ ...input });
};

export const getAllStays = () => StayModel.find({});

export const getUserStays = (partner: string) => UserStayModel.find({ partner }).sort('-createdAt');

export const getEstablishmentStays = (partner: string) => EstablishmentStayModel.find({ partner }).sort('-createdAt');

export const getStayById = async (_id: string) => {
  const stay = await StayModel.findById(_id);
  if (!stay) throw new NotFoundError('Stay not found');
  if (stay?.partnerType === EntityType.USER)
    return stay?.populate({ path: 'partner', select: 'firstName lastName email phoneNumber imgUrl', model: 'User' });
  return stay?.populate({ path: 'partner', select: 'name email phoneNumber imgUrl', model: 'Establishment' });
};

export const getTrendingStays = async () => {
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

export const createEstablishmentStay = async (input: Partial<EstablishmentStay>) => {
  return EstablishmentStayModel.create({ ...input });
};

export const udpateStay = async (_id: string, partner: string, body: Partial<UserStay>) => {
  const stay = (await StayModel.findById(_id)) as UserStay;
  if (!stay) throw new NotFoundError('Stay not found');
  if (stay.partner.toString() !== partner) throw new AuthorizationError();
  const udpated = await StayModel.updateOne({ _id }, { $set: body });
  if (!udpated.modifiedCount) throw new NotFoundError('Stay not found');
};

export const deleteStay = async (_id: string, partner: string) => {
  const stay = (await StayModel.findById(_id)) as UserStay;
  if (!stay) throw new NotFoundError('Stay not found');
  if (stay.partner.toString() !== partner) throw new AuthorizationError();
  const deleted = await StayModel.deleteOne({ _id });
  await ReservationModel.deleteMany({ property: _id });
  await ReviewModel.deleteMany({ property: _id });
  if (!deleted.deletedCount) throw new NotFoundError('Stay not found');
};

export const addAccommodation = async (_id: string, partner: string, body: UserStay['accommodation']) => {
  const stay = (await StayModel.findById(_id)) as UserStay;
  if (!stay) throw new NotFoundError('Stay not found');
  if (stay.partner.toString() !== partner) throw new AuthorizationError();
  const updated = await StayModel.updateOne({ _id }, { $addToSet: { accommodation: { $each: body } } });
  if (!updated.modifiedCount) throw new NotFoundError('Stay not found');
};

export const updateAccommodation = async (
  _id: string,
  partner: string,
  roomId: string,
  body: Partial<UserStay['accommodation'][0]>
) => {
  const stay = (await StayModel.findById(_id)) as UserStay;
  if (!stay) throw new NotFoundError('Stay not found');
  if (stay.partner.toString() !== partner) throw new AuthorizationError();
  if (!stay.accommodation.find((room) => room.id === roomId)) throw new BadRequestError('Accommodation not found');
  const updated = await StayModel.updateOne({ _id, 'accommodation.id': roomId }, { $set: { 'accommodation.$': body } });
  if (!updated.modifiedCount) throw new NotFoundError('Stay not found');
};

export const removeAccommodation = async (_id: string, partner: string, roomId: string) => {
  const stay = (await StayModel.findById(_id)) as UserStay;
  if (!stay) throw new NotFoundError('Stay not found');
  if (stay.partner.toString() !== partner) throw new AuthorizationError();
  if (!stay.accommodation.find((room) => room.id === roomId)) throw new BadRequestError('Accommodation not found');
  const updated = await StayModel.updateOne({ _id }, { $pull: { accommodation: { id: roomId } } });
  if (!updated.modifiedCount) throw new NotFoundError('Stay not found');
};

export const updateAccommodationAvailability = async (_id: string, roomId: string, quantity: number) => {
  return StayModel.updateOne({ _id, 'accommodation.id': roomId }, { $inc: { 'accommodation.$.available': quantity } });
};
