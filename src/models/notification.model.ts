import { getModelForClass, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { EntityType } from '@types';
import { Establishment } from './establishment.model';
import { User } from './user.model';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class Notification {
  @prop({ required: true, refPath: 'recipientType' })
  recipient!: Ref<User | Establishment>;

  @prop({ enum: EntityType, required: true, type: String })
  recipientType: EntityType;

  @prop({ required: true })
  message: string;

  @prop({ default: false })
  isRead: boolean;

  public createdAt: Date;
  public updatedAt: Date;
}

export const NotificationModel = getModelForClass(Notification);
