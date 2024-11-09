import { getModelForClass, index, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { IPaymentAuth, ISPs, VTUStatus, VTUType } from '@types';
import { User } from './user.model';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
@index({ createdAt: -1, user: 1 })
export class Receiver {
  @prop({ ref: () => 'User', required: true })
  user!: Ref<User>;

  @prop({ required: true })
  firstName!: string;

  @prop({ required: true })
  lastName!: string;

  @prop({ required: true })
  phoneNumber!: string;

  @prop({ required: true, enum: ISPs, type: String })
  network!: ISPs;

  public createdAt: Date;
  public updatedAt: Date;
}

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
@index({ createdAt: -1, user: 1 })
export class Transaction {
  @prop({ ref: () => 'User', required: true })
  user!: Ref<User>;

  @prop({ required: true })
  firstName!: string;

  @prop({ required: true })
  lastName!: string;

  @prop({ required: true })
  phoneNumber!: string;

  @prop({ required: true, enum: ISPs, type: String })
  network!: ISPs;

  @prop({ required: true })
  amount: number;

  @prop()
  dataValue?: string;

  @prop({ enum: VTUStatus, default: VTUStatus.PENDING, type: String })
  status: VTUStatus;

  @prop({ enum: VTUType, required: true, type: String })
  type: VTUType;

  @prop()
  payReference?: string;

  @prop({ _id: false })
  paymentAuth?: IPaymentAuth;

  public createdAt: Date;
  public updatedAt: Date;
}

export const ReceiverModel = getModelForClass(Receiver);
export const TransactionModel = getModelForClass(Transaction);
