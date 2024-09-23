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
