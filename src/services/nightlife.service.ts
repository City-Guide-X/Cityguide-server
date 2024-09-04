import { NotFoundError } from '@errors';
import { NightLife, NightLifeModel, ReservationModel, ReviewModel } from '@models';

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
