import { getModelForClass, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { Status } from '@types';
import { Establishment } from './establishment.model';
import { User } from './user.model';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class Reservation {
  @prop({ ref: () => 'Establishment', required: true })
  establishment!: Ref<Establishment>;

  @prop({ ref: () => 'User', required: true })
  user!: Ref<User>;

  @prop({ enum: Status, default: Status.PENDING, type: String })
  status: Status;

  @prop({ required: true })
  checkIn!: Date;

  @prop()
  checkOut: Date;

  @prop()
  class: string;

  @prop()
  reserveItem: number;

  @prop()
  noOfGuests: number;

  @prop({ select: false })
  __v?: number;

  public createdAt: Date;
  public updatedAt: Date;
}

export const ReservationModel = getModelForClass(Reservation);
