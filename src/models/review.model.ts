import { getModelForClass, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
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

  public createdAt: Date;
  public updatedAt: Date;
}

export const ReviewModel = getModelForClass(Review);
