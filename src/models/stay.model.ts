import {
  getDiscriminatorModelForClass,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  Severity,
} from '@typegoose/typegoose';
import { IAccommodation, IAddress, IExtraInfo, IStayRules, MaxDays, Rating, StayType } from '@types';
import { Establishment } from './establishment.model';
import { User } from './user.model';

@modelOptions({
  schemaOptions: { timestamps: true, discriminatorKey: 'partnerType' },
  options: { allowMixed: Severity.ALLOW },
})
export class Stay {
  @prop({ required: true })
  partnerType: string;

  @prop({ enum: StayType, required: true, type: String })
  type!: StayType;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  summary: string;

  @prop({ _id: false })
  extraInfo?: IExtraInfo;

  @prop({ required: true, _id: false })
  address: IAddress;

  @prop({ default: 0.0 })
  rating: Rating;

  @prop({ required: true })
  avatar: string;

  @prop({ required: true })
  images: string[];

  @prop({ required: true })
  amenities: string[];

  @prop({ enum: Rating, type: Number })
  hotelRating?: Rating;

  @prop({ required: true, _id: false })
  rules: IStayRules;

  @prop({ required: true, _id: false })
  accommodation: IAccommodation[];

  @prop({ enum: MaxDays, default: MaxDays.DEFAULT, type: Number })
  maxDays: MaxDays;

  @prop({ required: true })
  language: string[];

  public createdAt: Date;
  public updatedAt: Date;
}

export class UserStay extends Stay {
  @prop({ ref: () => User, required: true })
  partner!: Ref<User>;
}

export class EstablishmentStay extends Stay {
  @prop({ ref: () => Establishment, required: true })
  partner!: Ref<Establishment>;
}

export const StayModel = getModelForClass(Stay);
export const UserStayModel = getDiscriminatorModelForClass(StayModel, UserStay, 'USER');
export const EstablishmentStayModel = getDiscriminatorModelForClass(StayModel, EstablishmentStay, 'ESTABLISHMENT');
