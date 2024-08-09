import { PlaceData } from '@googlemaps/google-maps-services-js';

export const formatNearbyLocations = (res: Partial<PlaceData>) => ({
  name: res.name,
  geoLocation: res.geometry?.location,
  types: res.types,
});
