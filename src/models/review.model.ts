import { getModelForClass, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { Rating } from '@types';
import { Establishment } from './establishment.model';
import { User } from './user.model';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class Review {
  @prop({ ref: () => 'Establishment', required: true })
  establishment!: Ref<Establishment>;

  @prop({ ref: () => 'User', required: true })
  user!: Ref<User>;

  @prop({ enum: Rating, required: true, type: Number })
  rating!: Rating;

  @prop({ required: true })
  message!: string;

  @prop({ select: false })
  __v?: number;

  public createdAt: Date;
  public updatedAt: Date;
}

export const ReviewModel = getModelForClass(Review);
