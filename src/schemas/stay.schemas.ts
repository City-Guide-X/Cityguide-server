import { MaxDays, Parking, Rating, StayType } from '@types';
import { boolean, nativeEnum, number, object, string, TypeOf } from 'zod';

export const createStaySchema = object({
  body: object({
    type: nativeEnum(StayType, {
      required_error: 'Stay type is required',
      invalid_type_error: 'Stay type should be Hotel | Hostel | Resort | Apartment | BnB',
    }),
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
    address: object(
      {
        name: string({ required_error: 'Address name is required' }),
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
    images: string({ invalid_type_error: 'Images should be an array' }).array().optional(),
    amenities: string({
      required_error: 'Atleast one amenity is required',
      invalid_type_error: 'Amenities should be an array',
    })
      .array()
      .min(1, 'Atleast one amenity is required'),
    hotelRating: nativeEnum(Rating, { invalid_type_error: 'Hotel rating should be 0 | 1 | 2 | 3 | 4 | 5' }).optional(),
    rules: object(
      {
        checkIn: string({ required_error: 'Check-in time is required' }),
        checkOut: string({ required_error: 'Check-out time is required' }),
        smoking: boolean({
          required_error: 'Smoking rules are required',
          invalid_type_error: 'Smoking rules should be a boolean',
        }),
        pets: boolean({
          required_error: 'Pet rules are required',
          invalid_type_error: 'Pet rules should be a boolean',
        }),
        parties: boolean({
          required_error: 'Party rules are required',
          invalid_type_error: 'Party rules should be a boolean',
        }),
      },
      { required_error: 'Stay rules are required' }
    ),
    accommodation: object(
      {
        id: string({ required_error: 'Accommodation id is required' }),
        name: string({ required_error: 'Accommodation name is required' }),
        description: string().optional(),
        rooms: object(
          {
            name: string({ required_error: 'Room name is required' }),
            beds: object(
              {
                id: string({ required_error: 'Bed id is required' }),
                type: string({ required_error: 'Bed type is required' }),
                count: number({ required_error: 'Bed count is required' }),
              },
              { invalid_type_error: 'Accommodation rooms beds should be an array' }
            )
              .array()
              .min(1, 'Atleast one bed is required'),
          },
          {
            required_error: 'Atleast one room is required',
            invalid_type_error: 'Accommodation rooms should be an array',
          }
        )
          .array()
          .min(1, 'Atleast one room is required'),
        maxGuests: number({
          required_error: 'Maximum guests is required',
          invalid_type_error: 'Maximum guests should be a number',
        }),
        bathrooms: number({
          required_error: 'Number of bathrooms is required',
          invalid_type_error: 'Number of bathrooms should be a number',
        }),
        children: boolean({
          required_error: 'Children allowed is required',
          invalid_type_error: 'Children allowed should be a boolean',
        }),
        infants: boolean({
          required_error: 'Infants allowed is required',
          invalid_type_error: 'Infants allowed should be a boolean',
        }),
        breakfast: boolean({
          required_error: 'Breakfast availability is required',
          invalid_type_error: 'Breakfast should be a boolean',
        }),
        parking: nativeEnum(Parking, {
          required_error: 'Parking availability is required',
          invalid_type_error: 'Parking should be Paid | Free | No',
        }),
        size: number({ invalid_type_error: 'Accommodation size should be a number' }).optional(),
        initialAvailable: number({
          required_error: 'Initial number of available accommodations is required',
          invalid_type_error: 'Initial number of available accommodations should be a number',
        }),
        available: number({
          required_error: 'Number of available accommodations is required',
          invalid_type_error: 'Number of available accommodations should be a number',
        }),
        amenities: string({ invalid_type_error: 'Accommodation amenities should be an array' }).array().optional(),
        price: number({
          required_error: 'Price of the accommodation is required',
          invalid_type_error: 'Price of the accommodation should be a number',
        }),
      },
      {
        required_error: 'Atleast one accommodation is required',
        invalid_type_error: 'Accommodations should be an array',
      }
    )
      .array()
      .min(1, 'Atleast one accommodation is required'),
    maxDays: nativeEnum(MaxDays, { invalid_type_error: 'maxDays should be 30 | 45 | 60 | 90' }).optional(),
    language: string({
      required_error: 'Atleast one language is required',
      invalid_type_error: 'Languages should be an array',
    })
      .array()
      .min(1, 'Atleast one language is required'),
  }),
});

export type createStayInput = TypeOf<typeof createStaySchema>['body'];
