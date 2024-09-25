import { PropertyType } from '@types';

export const categoryMap = {
  [PropertyType.STAY]: [
    'Staff',
    'Facilities',
    'Cleanliness',
    'Comfort',
    'Value for Money',
    'Location',
    'Check-in/Check-out Process',
  ],
  [PropertyType.RESTAURANT]: [
    'Food Quality',
    'Menu Variety',
    'Service',
    'Ambiance',
    'Value for Money',
    'Cleanliness',
    'Location',
  ],
  [PropertyType.NIGHTLIFE]: [
    'Atmosphere',
    'Drink Quality/Selection',
    'Music/Entertainment',
    'Staff/Service',
    'Crowd',
    'Value for Money',
    'Safety',
  ],
};

export const defaultStayCatReviews = {
  Staff: 0.0,
  Facilities: 0.0,
  Cleanliness: 0.0,
  Comfort: 0.0,
  'Value for Money': 0.0,
  Location: 0.0,
  'Check-in/Check-out Process': 0.0,
};
export const defaultRestaurantCatReviews = {
  'Food Quality': 0.0,
  'Menu Variety': 0.0,
  Service: 0.0,
  Ambiance: 0.0,
  'Value for Money': 0.0,
  Cleanliness: 0.0,
  Location: 0.0,
};
export const defaultNightLifeCatReviews = {
  Atmosphere: 0.0,
  'Drink Quality/Selection': 0.0,
  'Music/Entertainment': 0.0,
  'Staff/Service': 0.0,
  Crowd: 0.0,
  'Value for Money': 0.0,
  Safety: 0.0,
};
