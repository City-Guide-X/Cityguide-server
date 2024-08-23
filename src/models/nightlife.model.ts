import { getModelForClass, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { IAddress, IContact, ICustomAvailability, INightLifeDetails, INightLifeRules, NightLifeType } from '@types';
import { Establishment } from './establishment.model';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class NightLife {
  @prop({ ref: () => 'Establishment', required: true })
  partner!: Ref<Establishment>;

  @prop({ enum: NightLifeType, required: true, type: String })
  type: NightLifeType;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  summary: string;

  @prop({ required: true, _id: false })
  address: IAddress;

  @prop({ default: 0.0 })
  rating: string;

  @prop({ default: 0 })
  reviewCount: number;

  @prop({ required: true })
  avatar: string;

  @prop({ required: true })
  images: string[];

  @prop({ required: true, _id: false })
  availability: ICustomAvailability[];

  @prop({ required: true, _id: false })
  rules: INightLifeRules;

  @prop({ required: true, _id: false })
  details: INightLifeDetails;

  @prop({ required: true, _id: false })
  contact: IContact;

  public createdAt: Date;
  public updatedAt: Date;
}

export const NightLifeModel = getModelForClass(NightLife);
