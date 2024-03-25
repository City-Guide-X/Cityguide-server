import { EstablishmentType } from '@types';
import { nativeEnum, number, object, string, TypeOf } from 'zod';

export const createEstablishmentSchema = object({
  body: object({
    name: string({ required_error: 'Establishment Name is required' }),
    description: string({
      required_error: 'Description of the establishment is required',
    }),
    address: object({
      name: string({ required_error: 'Address name is required' }),
      locationId: string({ required_error: 'Address location id is required' }),
      geoLocation: object({
        lat: number({
          required_error: 'Latitude is required',
          invalid_type_error: 'Latitude has to be a number',
        }),
        lng: number({
          required_error: 'Longitude is required',
          invalid_type_error: 'Longitude has to be a number',
        }),
      }),
      extraDetails: string().optional(),
    }),
    phoneNumber: string({ required_error: 'Phone number is required' }).min(11, 'Invalid phone number'),
    email: string({ required_error: 'Email is required' }).email('Invalid email'),
    password: string({ required_error: 'Password is required' }).min(8, 'Password should be atleast 8 characters'),
    type: nativeEnum(EstablishmentType, {
      required_error: 'Establishment type is required',
    }),
  }),
});

export const loginEstablishmentSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email('Invalid email'),
    password: string({ required_error: 'Password is required' }).min(8, 'Password should be atleast 8 characters'),
  }),
});

export type createEstablishmentInput = TypeOf<typeof createEstablishmentSchema>['body'];
export type loginEstablishmentInput = TypeOf<typeof loginEstablishmentSchema>['body'];

// availability: optional(
//   object({
//     day: string({ required_error: 'Available day is required' }),
//     from: string({ required_error: 'Opening time is required' }).regex(
//       /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
//       { message: 'The provided value is not a valid 24 hour time' }
//     ),
//     to: string({ required_error: 'Opening time is required' }).regex(
//       /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
//       { message: 'The provided value is not a valid 24 hour time' }
//     ),
//   })
// ),
