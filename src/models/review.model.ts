import { categoryMap } from '@constants';
import { BadRequestError } from '@errors';
import { getModelForClass, modelOptions, pre, prop, Ref, Severity } from '@typegoose/typegoose';
import { ICategoryRating, PropertyType } from '@types';
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
@pre<Review>('validate', function () {
  const requiredCategories = categoryMap[this.propertyType];
  const providedCategories = Object.keys(this.categoryRatings);
  if (providedCategories.length !== requiredCategories.length) throw new BadRequestError('Invalid categories provided');
  this.rating = Object.values(this.categoryRatings).reduce((acc, curr) => acc + curr, 0) / providedCategories.length;
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

  @prop({ required: true })
  categoryRatings: ICategoryRating;

  @prop({ required: true })
  rating!: number;

  @prop({ required: true })
  message!: string;

  @prop({ default: null })
  deletedAt: Date | null;

  public createdAt: Date;
  public updatedAt: Date;
}

export const ReviewModel = getModelForClass(Review);
