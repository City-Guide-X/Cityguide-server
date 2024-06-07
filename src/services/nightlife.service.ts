import { AuthorizationError } from '@errors';
import { NightLife, NightLifeModel } from '@models';

export const createNightLife = async (input: Partial<NightLife>) => {
  return NightLifeModel.create({ ...input });
};

export const getNightLifeById = async (_id: string) => {
  return NightLifeModel.findById(_id).populate('establishment', 'name email phoneNumber imgUrl', 'Establishment');
};

export const updateNightLife = async (_id: string, establishment: string, body: Partial<NightLife>) => {
  const nightlife = await NightLifeModel.findById(_id);
  if (nightlife?.establishment.toString() !== establishment) throw new AuthorizationError();
  return NightLifeModel.updateOne({ _id }, { $set: body });
};
