import { AuthorizationError, NotFoundError } from '@errors';
import { NightLife, NightLifeModel, NightLifeReservationModel, NightLifeReviewModel } from '@models';

export const createNightLife = async (input: Partial<NightLife>) => {
  return NightLifeModel.create({ ...input });
};

export const getAllNightlife = () => NightLifeModel.find({});

export const getNightLifeById = async (_id: string) => {
  const nightlife = await NightLifeModel.findById(_id).populate(
    'establishment',
    'name email phoneNumber imgUrl',
    'Establishment'
  );
  if (!nightlife) throw new NotFoundError('NightLife not found');
  return nightlife;
};

export const updateNightLife = async (_id: string, establishment: string, body: Partial<NightLife>) => {
  const nightlife = await NightLifeModel.findById(_id);
  if (!nightlife) throw new NotFoundError('NightLife not found');
  if (nightlife.establishment.toString() !== establishment) throw new AuthorizationError();
  const updated = await NightLifeModel.updateOne({ _id }, { $set: body });
  if (!updated.modifiedCount) throw new NotFoundError('NightLife not found');
};

export const deleteNightLife = async (_id: string, establishment: string) => {
  const nightlife = await NightLifeModel.findById(_id);
  if (!nightlife) throw new NotFoundError('NightLife not found');
  if (nightlife.establishment.toString() !== establishment) throw new AuthorizationError();
  const deleted = await NightLifeModel.deleteOne({ _id });
  await NightLifeReviewModel.deleteMany({ property: _id });
  await NightLifeReservationModel.deleteMany({ property: _id });
  if (!deleted.deletedCount) throw new NotFoundError('NightLife not found');
};
