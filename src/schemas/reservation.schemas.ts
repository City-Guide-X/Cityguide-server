import { Status } from '@types';
import { coerce, nativeEnum, number, object, string, TypeOf } from 'zod';

export const createReservationSchema = object({
  body: object({
    establishment: string({ required_error: 'Establishment ID is required' }),
    checkIn: coerce.date({ required_error: 'Check in date is required', invalid_type_error: 'Invalid date' }),
    checkOut: coerce.date({ invalid_type_error: 'Invalid date' }).optional(),
    class: string().optional(),
    reserveItem: number({ invalid_type_error: 'No of reserved items is a number' }).optional(),
    noOfGuests: number({ invalid_type_error: 'No of guests is a number' }).optional(),
  }),
});

export const updateReservationSchema = object({
  body: object({
    id: string({ required_error: 'Reservation ID is required' }),
    status: nativeEnum(Status, { required_error: 'Reservation Status is required' }),
  }),
});

export type createReservationInput = TypeOf<typeof createReservationSchema>['body'];
export type updateReservationInput = TypeOf<typeof updateReservationSchema>['body'];
