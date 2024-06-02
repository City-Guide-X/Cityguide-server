import { PriceRange } from '@types';
import { boolean, nativeEnum, number, object, string, TypeOf } from 'zod';

export const createRestaurantSchema = object({
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
    priceRange: nativeEnum(PriceRange, { required_error: 'Price range is required' }),
    serviceStyle: string({ invalid_type_error: 'Service style should be an array' }).array().optional(),
    cuisine: string({ invalid_type_error: 'Cuisine should be an array' }).array().optional(),
    dietaryProvisions: string({ invalid_type_error: 'Dietary provisions should be an array' }).array().optional(),
    amenities: string({ invalid_type_error: 'Amenities should be an array' }).array().optional(),
    paymentOptions: string({ invalid_type_error: 'Payment options should be an array' }).array().optional(),
    menu: object(
      {
        id: string({ required_error: 'Menu id is required' }),
        name: string({ required_error: 'Menu name is required' }).min(3, 'Menu name should be atleast 3 characters'),
        description: string({ required_error: 'Menu description is required' }).min(
          10,
          'Menu description should be atleast 10 characters'
        ),
        imgUrl: string({ required_error: 'Menu image is required' }),
        price: number({ invalid_type_error: 'Menu price should be a number' }).optional(),
        category: string().optional(),
        dietaryProvisions: string({ invalid_type_error: 'Menu dietary provisions should be an array' })
          .array()
          .optional(),
      },
      { required_error: 'Menu is required', invalid_type_error: 'Menu should be an array' }
    )
      .array()
      .min(1, 'Atleast one menu is required'),
    additionalInfo: object(
      {
        delivery: boolean({ required_error: 'Delivery availability is required' }),
        reservations: boolean({ required_error: 'Reservation availability is required' }),
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
      { required_error: 'Additional info is required' }
    ),
  }),
});

export type createRestaurantInput = TypeOf<typeof createRestaurantSchema>['body'];
