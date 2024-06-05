import {
  getDiscriminatorModelForClass,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  Severity,
} from '@typegoose/typegoose';
import { PropertyType, Rating } from '@types';
import { NightLife } from './nightlife.model';
import { Restaurant } from './restaurant.model';
import { Stay } from './stay.model';
import { User } from './user.model';

@modelOptions({
  schemaOptions: { timestamps: true, discriminatorKey: 'propertyType' },
  options: { allowMixed: Severity.ALLOW },
})
export class Review {
  @prop({ enum: PropertyType, required: true, type: String })
  propertyType: PropertyType;

  @prop({ ref: () => 'User', required: true })
  user!: Ref<User>;

  @prop({ enum: Rating, required: true, type: Number })
  rating!: Rating;

  @prop({ required: true })
  message!: string;

  public createdAt: Date;
  public updatedAt: Date;
}

export class StayReview extends Review {
  @prop({ ref: () => Stay, required: true })
  property!: Ref<Stay>;
}
export class RestaurantReview extends Review {
  @prop({ ref: () => Restaurant, required: true })
  property!: Ref<Restaurant>;
}
export class NightLifeReview extends Review {
  @prop({ ref: () => NightLife, required: true })
  property!: Ref<NightLife>;
}

export const ReviewModel = getModelForClass(Review);
export const StayReviewModel = getDiscriminatorModelForClass(ReviewModel, StayReview, PropertyType.STAY);
export const RestaurantReviewModel = getDiscriminatorModelForClass(
  ReviewModel,
  RestaurantReview,
  PropertyType.RESTAURANT
);
export const NightLifeReviewModel = getDiscriminatorModelForClass(ReviewModel, NightLifeReview, PropertyType.NIGHTLIFE);
