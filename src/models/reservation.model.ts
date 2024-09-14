import { getModelForClass, index, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { EntityType, IGuests, IReservationAccommodation, PropertyType, Status } from '@types';
import { refCode } from '@utils';
import { Establishment } from './establishment.model';
import { NightLife } from './nightlife.model';
import { Restaurant } from './restaurant.model';
import { Stay } from './stay.model';
import { User } from './user.model';

@modelOptions({
  schemaOptions: { timestamps: true, discriminatorKey: 'propertyType' },
  options: { allowMixed: Severity.ALLOW },
})
@index({ createdAt: 1 })
export class Reservation {
  @prop({ default: refCode, unique: true })
  reservationRef: string;

  @prop({ required: true, refPath: 'propertyType' })
  property!: Ref<Stay | Restaurant | NightLife>;

  @prop({ enum: PropertyType, required: true, type: String })
  propertyType: PropertyType;

  @prop({ ref: () => 'User', required: true })
  user!: Ref<User>;

  @prop({ required: true, refPath: 'ownerType' })
  partner!: Ref<User | Establishment>;

  @prop({ enum: EntityType, required: true, type: String })
  partnerType!: EntityType;

  @prop({ default: false })
  isAgent: boolean;

  @prop()
  guestFullName: string;

  @prop({ lowercase: true })
  guestEmail: string;

  @prop({ _id: false })
  requests: string[];

  @prop({ enum: Status, default: Status.PENDING, type: String })
  status: Status;

  @prop({ required: true })
  checkInDay!: Date;

  @prop({ required: true })
  checkInTime!: string;

  @prop({ required: true })
  checkOutDay!: Date;

  @prop({ required: true })
  checkOutTime!: string;

  @prop({ default: [], _id: false })
  accommodations: IReservationAccommodation[];

  @prop({ required: true })
  reservationCount: number;

  @prop({ required: true, _id: false })
  noOfGuests: IGuests;

  @prop()
  price: number;

  public createdAt: Date;
  public updatedAt: Date;
}

export const ReservationModel = getModelForClass(Reservation);
