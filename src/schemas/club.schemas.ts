import { Parking } from '@types';
import { nativeEnum, number, object, string, TypeOf } from 'zod';

export const createClubSchema = object({
  body: object({
    name: string({ required_error: 'Restaurant Name is required' }).min(
      3,
      'Restaurant name requires atleast 3 characters'
    ),
    summary: string({ required_error: 'Summary of the restaurant is required' }).min(
      10,
      'Summary should be atleast 10 characters'
    ),
    description: string().optional(),
    address: object(
      {
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
      },
      { required_error: 'Address is required' }
    ),
    avatar: string({ required_error: 'Avatar is required' }),
    images: string({ invalid_type_error: 'Images should be an array' }).array().optional(),
    availability: object(
      {
        day: string({ required_error: 'Day is required' }),
        from: string({ required_error: 'From time is required' }),
        to: string({ required_error: 'To time is required' }),
      },
      { required_error: 'Availability is required', invalid_type_error: 'Availability is should be an array' }
    )
      .array()
      .min(1, 'Atleast one availability is required'),
    socialMedia: object(
      {
        name: string({ required_error: 'Social media name is required' }),
        handle: string({ required_error: 'Social media handle is required' }),
      },
      { required_error: 'Social media is required', invalid_type_error: 'Social media should be an array' }
    )
      .array()
      .optional(),
    paymentOptions: string({ invalid_type_error: 'Payment options should be an array' }).array().optional(),
    rules: object({
      dressCode: string({
        required_error: 'Dress code is required',
        invalid_type_error: 'Dress code should be an array',
      }).array(),
      minAge: number({
        required_error: 'Minimum age is required',
        invalid_type_error: 'Minimum age should be a number',
      }),
      parking: nativeEnum(Parking, {
        required_error: 'Parking is required',
        invalid_type_error: 'Parking should be Free | Paid | No',
      }),
      musicGenre: string({
        required_error: 'Music genre is required',
        invalid_type_error: 'Music genre should be an array',
      }).array(),
    }).optional(),
    amenities: string({
      required_error: 'Atleast 1 amenity is required',
      invalid_type_error: 'Amenities should be an array',
    })
      .array()
      .min(1, 'Atleast one amenity is required'),
    entryFee: number({ invalid_type_error: 'Entry fee should be a number' }).optional(),
  }),
});

export type createClubInput = TypeOf<typeof createClubSchema>['body'];
