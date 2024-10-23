import { defaultNightLifeCatReviews } from '@constants';
import { getModelForClass, modelOptions, pre, prop, Ref, Severity } from '@typegoose/typegoose';
import {
  IAddress,
  ICategoryRating,
  IContact,
  ICustomAvailability,
  INightLifeDetails,
  INightLifeRules,
  NightLifeType,
} from '@types';
import { Query } from 'mongoose';
import { Establishment } from './establishment.model';

@pre<NightLife>('find', function (this: Query<any, any>) {
  this.where({ deletedAt: null });
})
@pre<NightLife>('findOne', function (this: Query<any, any>) {
  this.where({ deletedAt: null });
})
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

  @prop({ required: true })
  address: IAddress;

  @prop({ default: 0.0 })
  rating: number;

  @prop({ default: defaultNightLifeCatReviews })
  categoryRatings: ICategoryRating;

  @prop({ default: 0 })
  reviewCount: number;

  @prop({ required: true })
  avatar: string;

  @prop({ required: true })
  images: string[];

  @prop({ required: true, _id: false })
  availability: ICustomAvailability[];

  @prop({ required: true })
  rules: INightLifeRules;

  @prop({ required: true })
  details: INightLifeDetails;

  @prop({ required: true })
  contact: IContact;

  @prop({ required: true })
  currency: string;

  @prop({ default: null })
  deletedAt: Date | null;

  public createdAt: Date;
  public updatedAt: Date;
}

export const NightLifeModel = getModelForClass(NightLife);
