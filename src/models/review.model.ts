import { getModelForClass, modelOptions, pre, prop, Ref, Severity } from '@typegoose/typegoose';
import { PropertyType, Rating } from '@types';
import { Query } from 'mongoose';
import { NightLife } from './nightlife.model';
import { Restaurant } from './restaurant.model';
import { Stay } from './stay.model';
import { User } from './user.model';

@pre<Review>('find', function (this: Query<any, any>) {
  this.where({ deletedAt: null });
})
@pre<Review>('findOne', function (this: Query<any, any>) {
  this.where({ deletedAt: null });
})
@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class Review {
  @prop({ required: true, refPath: 'propertyType' })
  property!: Ref<Stay | Restaurant | NightLife>;

  @prop({ enum: PropertyType, required: true, type: String })
  propertyType: PropertyType;

  @prop({ ref: () => 'User', required: true })
  user!: Ref<User>;

  @prop({ enum: Rating, required: true, type: Number })
  rating!: Rating;

  @prop({ required: true })
  message!: string;

  @prop({ default: null })
  deletedAt: Date | null;

  public createdAt: Date;
  public updatedAt: Date;
}

export const ReviewModel = getModelForClass(Review);
