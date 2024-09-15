import { Establishment, NightLife, Reservation, Restaurant, Review, Stay } from '@models';
import { PropertyType, Status } from './enums';
import { Server } from 'socket.io';
import { TAction } from './common.interface';
import { IAccommodation, IMenu } from './model.interface';

export interface ClientToServerEvents {
  add_user: (userId: string) => void;
  create_reservation: (establishmentId: string, reservation: Partial<Reservation>) => void;
  update_reservation: (to: string, data: { reservationId: string; status: Status }) => void;
  create_review: (data: { establishmentId: string; review: Partial<Review> }) => void;
  delete_review: (data: { establishmentId: string; reviewId: string }) => void;
  update_establishment: (establishment: Partial<Establishment>) => void;
}
export interface ServerToClientEvents {
  ping: (val: string) => void;
  restaurant_menu: (data: { id: string; action: TAction; menuId?: string; body?: IMenu[] | IMenu }) => void;
  stay_acc: (data: { id: string; action: TAction; accId?: string; body?: IAccommodation[] | IAccommodation }) => void;
  update_property: (data: { id: string; type: PropertyType; body: Partial<Stay | Restaurant | NightLife> }) => void;
  delete_property: (data: { id: string; type: PropertyType }) => void;
  new_reservation: (reservation: Partial<Reservation>) => void;
  update_reservation: (data: { reservationId: string; status: Status }) => void;
  new_review: (data: { establishmentId: string; review: Partial<Review> }) => void;
  delete_review: (data: { establishmentId: string; reviewId: string }) => void;
  update_establishment: (establishment: Partial<Establishment>) => void;
}
export interface InterServerEvents {}
export interface SocketData {}

export type TSocket = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
