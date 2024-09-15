import { number, object, string, TypeOf } from 'zod';

export const createEstablishmentSchema = object({
  body: object({
    name: string({ required_error: 'Establishment Name is required' }).min(
      3,
      'Establishment name requires atleast 3 characters'
    ),
    description: string().optional(),
    address: object({
      name: string({ required_error: 'Address name is required' }),
      fullAddress: string().optional(),
      locationId: string({ required_error: 'Address location id is required' }),
      city: string().optional(),
      state: string({ required_error: 'State is required' }),
      country: string({ required_error: 'Country is required' }),
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
  }),
});

export const loginEstablishmentSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email('Invalid email'),
    password: string({ required_error: 'Password is required' }).min(8, 'Password should be atleast 8 characters'),
  }),
});

export const updateEstablishmentSchema = object({
  body: object({
    name: string().min(3, 'Establishment name requires atleast 3 characters').optional(),
    description: string().min(3, 'Establishment description requires atleast 3 characters').optional(),
    address: object({
      name: string({ required_error: 'Address name is required' }),
      fullAddress: string().optional(),
      locationId: string({ required_error: 'Address location id is required' }),
      city: string().optional(),
      state: string({ required_error: 'State is required' }),
      country: string({ required_error: 'Country is required' }),
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
    }).optional(),
    phoneNumber: string().min(11, 'Invalid phone number').optional(),
    imgUrl: string().optional(),
    cancellationPolicy: object({
      daysFromReservation: number({
        required_error: 'Days from reservation is required',
        invalid_type_error: 'Days from reservation should be a number',
      }).nonnegative(),
      percentRefundable: number({
        required_error: 'Percent refundable is required',
        invalid_type_error: 'Percent refundable should be a number',
      }).refine((val) => val >= 0 && val <= 1, { message: 'Percent refundable should be between 0 and 1' }),
    }).nullish(),
  }),
});

export type createEstablishmentInput = TypeOf<typeof createEstablishmentSchema>['body'];
export type loginEstablishmentInput = TypeOf<typeof loginEstablishmentSchema>['body'];
export type updateEstablishmentInput = TypeOf<typeof updateEstablishmentSchema>['body'];
