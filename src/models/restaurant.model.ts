import { getModelForClass, modelOptions, pre, prop, Ref, Severity } from '@typegoose/typegoose';
import { IAddress, IContact, ICustomAvailability, IMenu, IRestaurantDetails, PriceRange } from '@types';
import { Query } from 'mongoose';
import { Establishment } from './establishment.model';

@pre<Restaurant>('find', function (this: Query<any, any>) {
  this.where({ deletedAt: null });
})
@pre<Restaurant>('findOne', function (this: Query<any, any>) {
  this.where({ deletedAt: null });
})
@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class Restaurant {
  @prop({ ref: () => 'Establishment', required: true })
  partner!: Ref<Establishment>;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  summary: string;

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

  @prop({ required: true, _id: false })
  menu: IMenu[];

  @prop({ required: true, _id: false })
  details: IRestaurantDetails;

  @prop({ required: true, _id: false })
  contact: IContact;

  @prop({ default: null })
  deletedAt: Date | null;

  public createdAt: Date;
  public updatedAt: Date;
}

export const RestaurantModel = getModelForClass(Restaurant);
