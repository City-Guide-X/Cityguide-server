import { getModelForClass, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { IAddress, IClubRules, ICustomAvailability, ISocialLink, Rating } from '@types';
import { Establishment } from './establishment.model';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class Club {
  @prop({ ref: () => 'Establishment', required: true })
  establishment!: Ref<Establishment>;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  summary: string;

  @prop()
  description: string;

  @prop({ required: true, _id: false })
  address: IAddress;

  @prop({ default: 0.0 })
  rating: Rating;

  @prop({ required: true })
  avatar: string;

  @prop()
  images?: string[];

  @prop({ required: true, _id: false })
  availability: ICustomAvailability[];

  @prop({ _id: false })
  socialMedia?: ISocialLink[];

  @prop()
  paymentOptions: string[];

  @prop({ required: true, _id: false })
  rules: IClubRules;

  @prop({ required: true, _id: false })
  amenities: string[];

  @prop()
  entryFee?: number;

  public createdAt: Date;
  public updatedAt: Date;
}

export const ClubModel = getModelForClass(Club);
