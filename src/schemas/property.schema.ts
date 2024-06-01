import { MaxDays, Parking, Rating, StayType } from '@types';
import { boolean, nativeEnum, number, object, string, TypeOf } from 'zod';

export const createStaySchema = object({
  body: object({
    type: nativeEnum(StayType, { required_error: 'Stay type is required' }),
    name: string({ required_error: 'Stay Name is required' }).min(3, 'Stay name should be atleast 3 characters'),
    summary: string({ required_error: 'Summary of the stay is required' }).min(
      10,
      'Summary should be atleast 10 characters'
    ),
    extraInfo: object({
      host: object({
        name: string({ required_error: 'Host name is required' }),
        info: string({ required_error: 'Host description is required' }).min(
          10,
          'Host description should be atleast 10 characters'
        ),
      }).optional(),
      property: string().min(10, 'Property description should be atleast 10 characters').optional(),
      neighborhood: string().min(10, 'Neighborhood description should be atleast 10 characters').optional(),
    }).optional(),
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
    avatar: string({ required_error: 'Avatar is required' }),
    images: string().array().optional(),
    amenities: string().array().min(1, 'Atleast one amenity is required'),
    hotelRating: nativeEnum(Rating).optional(),
    rules: object({
      checkIn: string(),
      checkOut: string(),
      smoking: boolean(),
      pets: boolean(),
      parties: boolean(),
    }),
    accommodation: object({
      id: string({ required_error: 'Accommodation id is required' }),
      name: string({ required_error: 'Accommodation name is required' }),
      description: string().optional(),
      rooms: object({
        name: string({ required_error: 'Room name is required' }),
        beds: object({
          id: string({ required_error: 'Bed id is required' }),
          type: string({ required_error: 'Bed type is required' }),
          count: number({ required_error: 'Bed count is required' }),
        })
          .array()
          .min(1, 'Atleast one bed is required'),
      })
        .array()
        .min(1, 'Atleast one room is required'),
      maxGuests: number({ required_error: 'Maximum guests is required' }),
      bathrooms: number({ required_error: 'Number of bathrooms is required' }),
      children: boolean({ required_error: 'Children allowed is required' }),
      infants: boolean({ required_error: 'Infants allowed is required' }),
      breakfast: boolean({ required_error: 'Breakfast availability is required' }),
      parking: nativeEnum(Parking, { required_error: 'Parking availability is required' }),
      size: number().optional(),
      noAvailable: number({ required_error: 'Number of available accommodations is required' }),
      amenities: string().array().optional(),
      price: number({ required_error: 'Price of the accommodation is required' }),
    })
      .array()
      .min(1, 'Atleast one accommodation is required'),
    maxDays: nativeEnum(MaxDays).optional(),
    language: string().array().min(1, 'Atleast one language is required'),
  }),
});

export type createStayInput = TypeOf<typeof createStaySchema>['body'];
