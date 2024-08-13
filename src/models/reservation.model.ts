import {
  getDiscriminatorModelForClass,
  getModelForClass,
  index,
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
import { Establishment } from './establishment.model';

@modelOptions({
  schemaOptions: { timestamps: true, discriminatorKey: 'propertyType' },
  options: { allowMixed: Severity.ALLOW },
})
@index({ createdAt: 1 })
export class Reservation {
  @prop({ enum: PropertyType, required: true, type: String })
  propertyType: PropertyType;

  @prop({ ref: () => 'User', required: true })
  user!: Ref<User>;

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

export class UserStayReservation extends Reservation {
  @prop({ ref: () => Stay, required: true })
  property!: Ref<Stay>;

  @prop({ ref: () => User, required: true })
  owner!: Ref<User>;
}
export class EstablishmentStayReservation extends Reservation {
  @prop({ ref: () => Stay, required: true })
  property!: Ref<Stay>;

  @prop({ ref: () => Establishment, required: true })
  owner!: Ref<Establishment>;
}
export class RestaurantReservation extends Reservation {
  @prop({ ref: () => Restaurant, required: true })
  property!: Ref<Restaurant>;

  @prop({ ref: () => Establishment, required: true })
  owner!: Ref<Establishment>;
}
export class NightLifeReservation extends Reservation {
  @prop({ ref: () => NightLife, required: true })
  property!: Ref<NightLife>;

  @prop({ ref: () => Establishment, required: true })
  owner!: Ref<Establishment>;
}

export const ReservationModel = getModelForClass(Reservation);
export const UserStayReservationModel = getDiscriminatorModelForClass(
  ReservationModel,
  UserStayReservation,
  PropertyType.STAY
);
export const EstablishmentStayReservationModel = getDiscriminatorModelForClass(
  ReservationModel,
  EstablishmentStayReservation,
  PropertyType.STAY
);
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
