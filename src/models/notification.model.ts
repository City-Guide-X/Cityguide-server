import { getModelForClass, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { EntityType, NotificationType } from '@types';
import { Establishment } from './establishment.model';
import { User } from './user.model';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class Notification {
  @prop({ refPath: 'recipientType', required: true })
  recipient!: Ref<User | Establishment>;

  @prop({ enum: EntityType, required: true, type: String })
  recipientType: EntityType;

  @prop({ enum: NotificationType, required: true, type: String })
  type: NotificationType;

  @prop({ required: true })
  title: string;

  @prop({ required: true })
  message: string;

  @prop({ default: false })
  isRead: boolean;

  public createdAt: Date;
  public updatedAt: Date;
}

export const NotificationModel = getModelForClass(Notification);
