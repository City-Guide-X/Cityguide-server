import { getModelForClass, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { IAddress, ICustomAvailability, IMenu, IResAdditionalInfo, PriceRange, Rating } from '@types';
import { Establishment } from './establishment.model';
import { User } from './user.model';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class Restaurant {
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

  @prop({ required: true })
  avatar: string;

  @prop()
  images?: string[];

  @prop({ default: 0.0 })
  rating: Rating;

  @prop({ required: true, _id: false })
  availability: ICustomAvailability[];

  @prop({ enum: PriceRange, required: true, type: String })
  priceRange: PriceRange;

  @prop()
  serviceStyle: string[];

  @prop()
  cuisine: string[];

  @prop()
  dietaryProvisions: string[];

  @prop()
  amenities: string[];

  @prop()
  paymentOptions: string[];

  @prop({ required: true, _id: false })
  menu: IMenu[];

  @prop({ required: true, _id: false })
  additionalInfo: IResAdditionalInfo;

  public createdAt: Date;
  public updatedAt: Date;
}

export class UserRestaurant extends Restaurant {
  @prop({ ref: () => 'User', required: true })
  user!: Ref<User>;
}

export const RestaurantModel = getModelForClass(Restaurant);
