import { PropertyType, Status } from '@types';
import { coerce, nativeEnum, number, object, string, TypeOf } from 'zod';

export const createReservationSchema = object({
  body: object({
    property: string({ required_error: 'Property id is required' }),
    propertyType: nativeEnum(PropertyType, {
      required_error: 'Property type is required',
      invalid_type_error: 'Property type should be a Stay | Restaurant | Club',
    }),
    checkInDay: coerce.date({ required_error: 'From date is required', invalid_type_error: 'Invalid date' }),
    checkInTime: string({ required_error: 'Check-in time is required' }).regex(
      /^\d{2}:\d{2}$/,
      'Check-in time should be in HH:MM 23-hour format'
    ),
    checkOutDay: coerce.date({ required_error: 'To date is required', invalid_type_error: 'Invalid date' }),
    checkOutTime: string({ required_error: 'Check-out time is required' }).regex(
      /^\d{2}:\d{2}$/,
      'Check-out time should be in HH:MM 23-hour format'
    ),
    roomId: string().optional(),
    reservationCount: number({
      required_error: 'Reservation count is required',
      invalid_type_error: 'Reservation count is a number',
    }),
    noOfGuests: object(
      {
        adults: number({
          required_error: 'Number of adults is required',
          invalid_type_error: 'Number of adults is a number',
        }),
        children: number({
          required_error: 'Number of children is required',
          invalid_type_error: 'Number of children is a number',
        }),
      },
      { required_error: 'Number of guests is required' }
    ),
    price: number({ invalid_type_error: 'Price is a number' }).optional(),
  }).refine(
    (data) =>
      data.propertyType !== PropertyType.STAY || (data.propertyType === PropertyType.STAY && data.roomId && data.price),
    {
      message: 'Room ID and Price are required for Stay reservations',
      path: ['roomId', 'price'],
    }
  ),
});

export const updateReservationSchema = object({
  body: object({
    id: string({ required_error: 'Reservation ID is required' }),
    status: nativeEnum(Status, { required_error: 'Reservation Status is required' }),
  }),
});

export type createReservationInput = TypeOf<typeof createReservationSchema>['body'];
export type updateReservationInput = TypeOf<typeof updateReservationSchema>['body'];
