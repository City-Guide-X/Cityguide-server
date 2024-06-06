import { NightLife, NightLifeModel } from '@models';

export const createNightLife = async (input: Partial<NightLife>) => {
  return NightLifeModel.create({ ...input });
};

export const getNightLifeById = async (_id: string) => {
  return NightLifeModel.findById(_id).populate('establishment', 'name email phoneNumber imgUrl', 'Establishment');
};
