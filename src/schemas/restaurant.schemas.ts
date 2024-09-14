import { DayOfWeek, PriceRange } from '@types';
import { boolean, coerce, nativeEnum, number, object, strictObject, string, TypeOf, ZodIssueCode } from 'zod';

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
      .min(7, 'Atleast 7 images are required'),
    availability: object(
      {
        day: nativeEnum(DayOfWeek, {
          required_error: 'Day is required',
          invalid_type_error: 'Day should be a day of the week in full and capitalized',
        }),
        from: string({ required_error: 'From time is required' }).regex(
          /^\d{2}:\d{2}$/,
          'From time should be in HH:MM 23-hour format'
        ),
        to: string({ required_error: 'To time is required' }).regex(
          /^\d{2}:\d{2}$/,
          'To time should be in HH:MM 23-hour format'
        ),
      },
      { required_error: 'Availability is required', invalid_type_error: 'Availability is should be an array' }
    )
      .array()
      .min(1, 'Atleast one availability is required'),
    priceRange: nativeEnum(PriceRange, {
      required_error: 'Price range is required',
      invalid_type_error: 'Price range should be Budget-friendly | Mid-range | Fine-dining',
    }),
    serviceStyle: string({ invalid_type_error: 'Service style should be an array' }).array().optional(),
    cuisine: string({ invalid_type_error: 'Cuisine should be an array' }).array().optional(),
    dietaryProvisions: string({ invalid_type_error: 'Dietary provisions should be an array' }).array().optional(),
    menu: object(
      {
        id: string({ required_error: 'Menu item id is required' }),
        name: string({ required_error: 'Menu item name is required' }).min(
          3,
          'Menu item name should be atleast 3 characters'
        ),
        description: string({ required_error: 'Menu item description is required' }).min(
          10,
          'Menu item description should be atleast 10 characters'
        ),
        imgUrl: string({ required_error: 'Menu item image is required' }),
        price: number({ invalid_type_error: 'Menu item price should be a number' }).optional(),
        category: string({ invalid_type_error: 'Menu item category should be an array' }).array().optional(),
        dietaryProvisions: string({ invalid_type_error: 'Menu item dietary provisions should be an array' })
          .array()
          .optional(),
      },
      { required_error: 'Menu item is required', invalid_type_error: 'Menu item should be an array' }
    )
      .array()
      .min(1, 'Atleast one menu item is required'),
    details: object(
      {
        delivery: boolean({
          required_error: 'Delivery availability is required',
          invalid_type_error: 'Delivery availability should be a boolean',
        }),
        reservation: object(
          {
            max: number({
              required_error: 'Max reservation per table is required',
              invalid_type_error: 'Max reservation per table should be a number',
            }),
            available: number({
              required_error: 'Number of available tables is required',
              invalid_type_error: 'Number of available tables should be a number',
            }),
            price: number({
              required_error: 'Reservation price per person is required',
              invalid_type_error: 'Reservation price per person should be number',
            }),
          },
          { invalid_type_error: 'Reservation info should be an object containing max, available and price' }
        ).optional(),
        amenities: string({
          required_error: 'Atleast 1 amenity is required',
          invalid_type_error: 'Amenities should be an array',
        })
          .array()
          .min(1, 'Atleast one amenity is required'),
        paymentOptions: string({
          required_error: 'Payment options is required',
          invalid_type_error: 'Payment options should be an array',
        })
          .array()
          .min(1, 'Atleast 1 payment option is required'),
        children: boolean({
          required_error: 'Children allowance rule is required',
          invalid_type_error: 'Children allowance rule should be a boolean',
        }),
      },
      { required_error: 'Restaurant details is required' }
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

export const getRestaurantDetailSchema = object({
  params: object({
    restaurantId: string({ required_error: 'Restaurant id is required' }),
  }),
});

export const updateRestaurantSchema = object({
  body: strictObject({
    name: string().min(3, 'Restaurant name requires atleast 3 characters').optional(),
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
      .min(7, 'Atleast 7 images are required')
      .optional(),
    availability: object(
      {
        day: nativeEnum(DayOfWeek, {
          required_error: 'Day is required',
          invalid_type_error: 'Day should be a day of the week in full and capitalized',
        }),
        from: string({ required_error: 'From time is required' }).regex(
          /^\d{2}:\d{2}$/,
          'From time should be in HH:MM 23-hour format'
        ),
        to: string({ required_error: 'To time is required' }).regex(
          /^\d{2}:\d{2}$/,
          'To time should be in HH:MM 23-hour format'
        ),
      },
      { invalid_type_error: 'Availability is should be an array' }
    )
      .array()
      .min(1, 'Atleast one availability is required')
      .optional(),
    priceRange: nativeEnum(PriceRange, {
      invalid_type_error: 'Price range should be Budget-friendly | Mid-range | Fine-dining',
    }).optional(),
    serviceStyle: string({ invalid_type_error: 'Service style should be an array' }).array().optional(),
    cuisine: string({ invalid_type_error: 'Cuisine should be an array' }).array().optional(),
    dietaryProvisions: string({ invalid_type_error: 'Dietary provisions should be an array' }).array().optional(),
    details: object({
      delivery: boolean({
        required_error: 'Delivery availability is required',
        invalid_type_error: 'Delivery availability should be a boolean',
      }),
      reservation: object(
        {
          max: number({
            required_error: 'Max reservation per table is required',
            invalid_type_error: 'Max reservation per table should be a number',
          }),
          available: number({
            required_error: 'Number of available tables is required',
            invalid_type_error: 'Number of available tables should be a number',
          }),
          price: number({
            required_error: 'Reservation price per person is required',
            invalid_type_error: 'Reservation price per person should be number',
          }),
        },
        { invalid_type_error: 'Reservation info should be an object containing max, available and price' }
      ).optional(),
      amenities: string({
        required_error: 'Atleast 1 amenity is required',
        invalid_type_error: 'Amenities should be an array',
      })
        .array()
        .min(1, 'Atleast one amenity is required'),
      paymentOptions: string({
        required_error: 'Payment options is required',
        invalid_type_error: 'Payment options should be an array',
      })
        .array()
        .min(1, 'Atleast 1 payment option is required'),
      children: boolean({
        required_error: 'Children allowance rule is required',
        invalid_type_error: 'Children allowance rul should be a boolean',
      }),
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
    restaurantId: string({ required_error: 'Restaurant id is required' }),
  }),
});

export const deleteRestaurantSchema = object({
  params: object({
    restaurantId: string({ required_error: 'Restaurant id is required' }),
  }),
});

export const addMenuSchema = object({
  body: object(
    {
      id: string({ required_error: 'Menu item id is required' }),
      name: string({ required_error: 'Menu item name is required' }).min(
        3,
        'Menu item name should be atleast 3 characters'
      ),
      description: string({ required_error: 'Menu item description is required' }).min(
        10,
        'Menu item description should be atleast 10 characters'
      ),
      imgUrl: string({ required_error: 'Menu item image is required' }),
      price: number({ invalid_type_error: 'Menu item price should be a number' }).optional(),
      category: string({ invalid_type_error: 'Menu item category should be an array' }).array().optional(),
      dietaryProvisions: string({ invalid_type_error: 'Menu item dietary provisions should be an array' })
        .array()
        .optional(),
    },
    { required_error: 'Menu item is required', invalid_type_error: 'Menu item should be an array' }
  )
    .array()
    .min(1, 'Atleast one menu item is required'),
  params: object({
    restaurantId: string({ required_error: 'Restaurant id is required' }),
  }),
});

export const updateMenuSchema = object({
  body: object(
    {
      id: string({ required_error: 'Menu item id is required' }),
      name: string({ required_error: 'Menu item name is required' }).min(
        3,
        'Menu item name should be atleast 3 characters'
      ),
      description: string({ required_error: 'Menu item description is required' }).min(
        10,
        'Menu item description should be atleast 10 characters'
      ),
      imgUrl: string({ required_error: 'Menu item image is required' }),
      price: number({ invalid_type_error: 'Menu item price should be a number' }).optional(),
      category: string({ invalid_type_error: 'Menu item category should be an array' }).array().optional(),
      dietaryProvisions: string({ invalid_type_error: 'Menu item dietary provisions should be an array' })
        .array()
        .optional(),
    },
    { required_error: 'Menu item is required' }
  ),
  params: object({
    restaurantId: string({ required_error: 'Restaurant id is required' }),
    menuId: string({ required_error: 'Menu item id is required' }),
  }),
});

export const removeMenuSchema = object({
  params: object({
    restaurantId: string({ required_error: 'Restaurant id is required' }),
    menuId: string({ required_error: 'Menu item id is required' }),
  }),
});

export const getAllRestautantSchema = object({
  query: object({
    lat: coerce.number({ invalid_type_error: 'Latitude has to be a number' }).optional(),
    lng: coerce.number({ invalid_type_error: 'Longitude has to be a number' }).optional(),
  }),
});

export const searchRestaurantSchema = object({
  query: object({
    lat: coerce.number({ invalid_type_error: 'Latitude has to be a number' }).optional(),
    lng: coerce.number({ invalid_type_error: 'Longitude has to be a number' }).optional(),
    day: nativeEnum(DayOfWeek, {
      invalid_type_error: 'Day should be a day of the week in full and capitalized',
    }).optional(),
    time: string()
      .regex(/^\d{2}:\d{2}$/, 'Time should be in HH:MM 23-hour format')
      .optional(),
    children: string().optional(),
    guests: coerce.number({ invalid_type_error: 'No of guests should be a number' }).optional(),
    count: coerce.number({ invalid_type_error: 'Reservation count should be a number' }).optional(),
  }).superRefine((data, ctx) => {
    if (!!data.lat !== !!data.lng) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: !!data.lat
          ? 'Longitude is required when Latitude is provided'
          : 'Latitude is required when Longitude is provided',
        path: ['lat', 'lng'],
      });
    }
    if (!!data.day !== !!data.time) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: !!data.day ? 'Time is required when the day is provided' : 'Day is required when the time is provided',
        path: ['day', 'time'],
      });
    }
  }),
});

export type createRestaurantInput = TypeOf<typeof createRestaurantSchema>['body'];
export type getRestaurantDetailInput = TypeOf<typeof getRestaurantDetailSchema>['params'];
export type updateRestaurantInput = TypeOf<typeof updateRestaurantSchema>;
export type deleteRestaurantInput = TypeOf<typeof deleteRestaurantSchema>['params'];
export type addMenuInput = TypeOf<typeof addMenuSchema>;
export type updateMenuInput = TypeOf<typeof updateMenuSchema>;
export type removeMenuInput = TypeOf<typeof removeMenuSchema>['params'];
export type getAllRestautantInput = TypeOf<typeof getAllRestautantSchema>['query'];
export type searchRestaurantInput = TypeOf<typeof searchRestaurantSchema>['query'];
