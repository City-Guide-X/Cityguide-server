import { NotFoundError } from '@errors';
import { NightLife, NightLifeModel, ReservationModel, ReviewModel } from '@models';

export const createNightLife = (input: Partial<NightLife>) => {
  return NightLifeModel.create({ ...input });
};

export const getAllNightlife = () => {
  return NightLifeModel.find({});
};

export const getNightLifeById = (_id: string) => {
  return NightLifeModel.findById(_id).populate({
    path: 'establishment',
    select: 'name email phoneNumber imgUrl',
  });
};

export const updateNightLife = (_id: string, partner: string, body: Partial<NightLife>) => {
  return NightLifeModel.updateOne({ _id, partner }, { $set: body });
};

export const deleteNightLife = async (_id: string, partner: string) => {
  const { deletedCount } = await NightLifeModel.deleteOne({ _id, partner });
  if (!deletedCount) throw new NotFoundError('NightLife not found');
  await Promise.all([ReviewModel.deleteMany({ property: _id }), ReservationModel.deleteMany({ property: _id })]);
};
