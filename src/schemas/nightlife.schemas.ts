import { DayOfWeek, NightLifeType, Parking } from '@types';
import { coerce, nativeEnum, number, object, strictObject, string, TypeOf } from 'zod';

export const createNightLifeSchema = object({
  body: object({
    type: nativeEnum(NightLifeType, {
      required_error: 'NightLife type is required',
      invalid_type_error: 'NightLife type should be a Club | Bar | Lounge | Other',
    }),
    name: string({ required_error: 'NightLife Name is required' }).min(
      3,
      'NightLife name requires atleast 3 characters'
    ),
    summary: string({ required_error: 'Summary of the NightLife is required' }).min(
      10,
      'Summary should be atleast 10 characters'
    ),
    address: object(
      {
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
      },
      { required_error: 'Address is required' }
    ),
    avatar: string({ required_error: 'Avatar is required' }),
    images: string({ required_error: 'Images is required', invalid_type_error: 'Images should be an array' })
      .array()
      .min(11, 'Atleast 11 images are required'),
    availability: object(
      {
        day: nativeEnum(DayOfWeek, {
          required_error: 'Day is required',
          invalid_type_error: 'Day should be a day of the week in full and capitalized',
        }),
        from: string({ required_error: 'From time is required' }),
        to: string({ required_error: 'To time is required' }),
      },
      { required_error: 'Availability is required', invalid_type_error: 'Availability is should be an array' }
    )
      .array()
      .min(1, 'Atleast one availability is required'),
    rules: object(
      {
        dressCode: string({ invalid_type_error: 'Dress code should be an array' }).array().optional(),
        minAge: number({
          required_error: 'Minimum age is required',
          invalid_type_error: 'Minimum age should be a number',
        }),
        parking: nativeEnum(Parking, {
          required_error: 'Parking is required',
          invalid_type_error: 'Parking should be Free | Paid | No',
        }),
        musicGenre: string({ invalid_type_error: 'Music genre should be an array' }).array().optional(),
      },
      { required_error: 'NightLife rules are required' }
    ),
    details: object(
      {
        entryFee: number({ invalid_type_error: 'Entry fee should be a number' }).optional(),
        paymentOptions: string({
          required_error: 'Payment options are required',
          invalid_type_error: 'Payment options should be an array',
        })
          .array()
          .min(1, 'Atleast one payment option is required'),
        amenities: string({
          required_error: 'Atleast 1 amenity is required',
          invalid_type_error: 'Amenities should be an array',
        })
          .array()
          .min(1, 'Atleast one amenity is required'),
      },
      { required_error: 'NightLife details are required' }
    ),
    contact: object(
      {
        email: string({ required_error: 'Email is required' }).email('Email should be a valid email'),
        phone: string({ required_error: 'Phone number is required' }).min(11, 'Invalid phone number'),
        socialMedia: object(
          {
            name: string({ required_error: 'Social media name is required' }),
            handle: string({ required_error: 'Social media handle is required' }),
          },
          { required_error: 'Social media is required', invalid_type_error: 'Social media should be an array' }
        )
          .array()
          .optional(),
      },
      { required_error: 'Contact is required' }
    ),
  }),
});

export const getNightLifeDetailSchema = object({
  params: object({
    nightLifeId: string({ required_error: 'NightLife id is required' }),
  }),
});

export const updateNightLifeSchema = object({
  body: strictObject({
    type: nativeEnum(NightLifeType, {
      invalid_type_error: 'NightLife type should be a Club | Bar | Lounge | Other',
    }).optional(),
    name: string().min(3, 'NightLife name requires atleast 3 characters').optional(),
    summary: string().min(10, 'Summary should be atleast 10 characters').optional(),
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
    avatar: string().optional(),
    images: string({ invalid_type_error: 'Images should be an array' })
      .array()
      .min(11, 'Atleast 11 images are required')
      .optional(),
    availability: object(
      {
        day: nativeEnum(DayOfWeek, {
          required_error: 'Day is required',
          invalid_type_error: 'Day should be a day of the week in full and capitalized',
        }),
        from: string({ required_error: 'From time is required' }),
        to: string({ required_error: 'To time is required' }),
      },
      { invalid_type_error: 'Availability is should be an array' }
    )
      .array()
      .min(1, 'Atleast one availability is required')
      .optional(),
    rules: object({
      dressCode: string({ invalid_type_error: 'Dress code should be an array' }).array().optional(),
      minAge: number({
        required_error: 'Minimum age is required',
        invalid_type_error: 'Minimum age should be a number',
      }),
      parking: nativeEnum(Parking, {
        required_error: 'Parking is required',
        invalid_type_error: 'Parking should be Free | Paid | No',
      }),
      musicGenre: string({ invalid_type_error: 'Music genre should be an array' }).array().optional(),
    }).optional(),
    details: object({
      entryFee: number({ invalid_type_error: 'Entry fee should be a number' }).optional(),
      paymentOptions: string({
        required_error: 'Payment options are required',
        invalid_type_error: 'Payment options should be an array',
      })
        .array()
        .min(1, 'Atleast one payment option is required'),
      amenities: string({
        required_error: 'Atleast 1 amenity is required',
        invalid_type_error: 'Amenities should be an array',
      })
        .array()
        .min(1, 'Atleast one amenity is required'),
    }).optional(),
    contact: object({
      email: string({ required_error: 'Email is required' }).email('Email should be a valid email'),
      phone: string({ required_error: 'Phone number is required' }).min(11, 'Invalid phone number'),
      socialMedia: object(
        {
          name: string({ required_error: 'Social media name is required' }),
          handle: string({ required_error: 'Social media handle is required' }),
        },
        { required_error: 'Social media is required', invalid_type_error: 'Social media should be an array' }
      )
        .array()
        .optional(),
    }).optional(),
  }),
  params: object({
    nightLifeId: string({ required_error: 'NightLife id is required' }),
  }),
});

export const deleteNightLifeSchema = object({
  params: object({
    nightLifeId: string({ required_error: 'NightLife id is required' }),
  }),
});

export const getAllNightlifeSchema = object({
  query: object({
    lat: coerce.number({ invalid_type_error: 'Latitude has to be a number' }).optional(),
    lng: coerce.number({ invalid_type_error: 'Longitude has to be a number' }).optional(),
  }),
});

export type createNightLifeInput = TypeOf<typeof createNightLifeSchema>['body'];
export type getNightLifeDetailInput = TypeOf<typeof getNightLifeDetailSchema>['params'];
export type updateNightLifeInput = TypeOf<typeof updateNightLifeSchema>;
export type deleteNightLifeInput = TypeOf<typeof deleteNightLifeSchema>['params'];
export type getAllNightlifeInput = TypeOf<typeof getAllNightlifeSchema>['query'];
