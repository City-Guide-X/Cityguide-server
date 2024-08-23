import { getModelForClass, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import {
  EntityType,
  IAccommodation,
  IAddress,
  IExtraInfo,
  IOptionalService,
  IStayRules,
  MaxDays,
  Rating,
  StayType,
} from '@types';
import { Establishment } from './establishment.model';
import { User } from './user.model';

@modelOptions({
  schemaOptions: { timestamps: true, discriminatorKey: 'partnerType' },
  options: { allowMixed: Severity.ALLOW },
})
export class Stay {
  @prop({ required: true, refPath: 'partnerType' })
  partner!: Ref<User | Establishment>;

  @prop({ enum: EntityType, required: true, type: String })
  partnerType: EntityType;

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
  rating: string;

  @prop({ default: 0 })
  reviewCount: number;

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

  @prop({ default: [] })
  optionalServices: IOptionalService[];

  public createdAt: Date;
  public updatedAt: Date;
}

export const StayModel = getModelForClass(Stay);
