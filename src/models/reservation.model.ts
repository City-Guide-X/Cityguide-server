import {
  getDiscriminatorModelForClass,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  Severity,
} from '@typegoose/typegoose';
import { IGuests, PropertyType, Status } from '@types';
import { NightLife } from './nightlife.model';
import { Restaurant } from './restaurant.model';
import { Stay } from './stay.model';
import { User } from './user.model';

@modelOptions({
  schemaOptions: { timestamps: true, discriminatorKey: 'propertyType' },
  options: { allowMixed: Severity.ALLOW },
})
export class Reservation {
  @prop({ enum: PropertyType, required: true, type: String })
  propertyType: PropertyType;

  @prop({ ref: () => 'User', required: true })
  user!: Ref<User>;

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

  @prop()
  roomId: string;

  @prop({ required: true })
  reservationCount: number;

  @prop({ required: true, _id: false })
  noOfGuests: IGuests;

  @prop()
  price: number;

  public createdAt: Date;
  public updatedAt: Date;
}

export class StayReservation extends Reservation {
  @prop({ ref: () => Stay, required: true })
  property!: Ref<Stay>;
}
export class RestaurantReservation extends Reservation {
  @prop({ ref: () => Restaurant, required: true })
  property!: Ref<Restaurant>;
}
export class NightLifeReservation extends Reservation {
  @prop({ ref: () => NightLife, required: true })
  property!: Ref<NightLife>;
}

export const ReservationModel = getModelForClass(Reservation);
export const StayReservationModel = getDiscriminatorModelForClass(ReservationModel, StayReservation, PropertyType.STAY);
export const RestaurantReservationModel = getDiscriminatorModelForClass(
  ReservationModel,
  RestaurantReservation,
  PropertyType.RESTAURANT
);
export const NightLifeReservationModel = getDiscriminatorModelForClass(
  ReservationModel,
  NightLifeReservation,
  PropertyType.NIGHTLIFE
);
