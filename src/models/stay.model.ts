import { getModelForClass, modelOptions, pre, prop, Ref, Severity } from '@typegoose/typegoose';
import {
  EntityType,
  HotelRating,
  IAccommodation,
  IAddress,
  IExtraInfo,
  IOptionalService,
  IStayRules,
  MaxDays,
  Rating,
  StayType,
} from '@types';
import { Query } from 'mongoose';
import { Establishment } from './establishment.model';
import { User } from './user.model';

@pre<Stay>('find', function (this: Query<any, any>) {
  this.where({ deletedAt: null });
})
@pre<Stay>('findOne', function (this: Query<any, any>) {
  this.where({ deletedAt: null });
})
@modelOptions({
  schemaOptions: { timestamps: true },
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
  rating: number;

  @prop({ default: 0 })
  reviewCount: number;

  @prop({ required: true })
  avatar: string;

  @prop({ required: true })
  images: string[];

  @prop({ required: true })
  amenities: string[];

  @prop({ enum: HotelRating, type: Number })
  hotelRating?: HotelRating;

  @prop({ required: true, _id: false })
  rules: IStayRules;

  @prop({ required: true, _id: false })
  accommodation: IAccommodation[];

  @prop({ enum: MaxDays, default: MaxDays.DEFAULT, type: Number })
  maxDays: MaxDays;

  @prop({ required: true })
  language: string[];

  @prop({ required: true })
  paymentMethods: string[];

  @prop({ default: [] })
  optionalServices: IOptionalService[];

  @prop({ default: null })
  deletedAt: Date | null;

  public createdAt: Date;
  public updatedAt: Date;
}

export const StayModel = getModelForClass(Stay);
