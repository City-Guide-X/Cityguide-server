import { PlaceData } from '@googlemaps/google-maps-services-js';
import { privateFields } from '@models';
import { omit } from 'lodash';

export const formatNearbyLocations = (res: Partial<PlaceData>) => ({
  name: res.name,
  geoLocation: res.geometry?.location,
  types: res.types,
});

export const sanitizeEngagement = (engagement: any) => ({
  ...omit(engagement, privateFields),
  user: engagement.user[0] ? omit(engagement.user[0], privateFields) : null,
});
