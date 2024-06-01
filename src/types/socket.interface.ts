import { Establishment, Reservation, Review } from '@models';
import { Status } from './enums';

export interface ClientToServerEvents {
  add_user: (userId: string) => void;
  add_establishment: (establishmentId: string) => void;
  create_reservation: (establishmentId: string, reservation: Partial<Reservation>) => void;
  update_reservation: (to: string, data: { reservationId: string; status: Status }) => void;
  create_review: (data: { establishmentId: string; review: Partial<Review> }) => void;
  delete_review: (data: { establishmentId: string; reviewId: string }) => void;
  update_establishment: (establishment: Partial<Establishment>) => void;
}
export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  new_reservation: (reservation: Partial<Reservation>) => void;
  updated_reservation: (data: { reservationId: string; status: Status }) => void;
  new_review: (data: { establishmentId: string; review: Partial<Review> }) => void;
  deleted_review: (data: { establishmentId: string; reviewId: string }) => void;
  updated_establishment: (establishment: Partial<Establishment>) => void;
}
export interface InterServerEvents {
  ping: () => void;
}
export interface SocketData {
  name: string;
  age: number;
}
