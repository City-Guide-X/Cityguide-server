import { Client } from '@googlemaps/google-maps-services-js';
import { ILatLng } from '@types';
import { formatNearbyLocations } from '@utils';

const client = new Client({});
const key = process.env.GOOGLE_MAPS_API_KEY!;
const logding = ['lodging', 'point_of_interest', 'establishment'];
const locality = ['locality', 'political'];

export const calculateDistance = async (origins: ILatLng[], destinations: ILatLng[]) => {
  const res = await client.distancematrix({ params: { key, origins, destinations } });
  if (res.status !== 200) return;
  return res.data.rows[0].elements;
};

export const nearbyLocations = async (location: ILatLng) => {
  const res = await client.placesNearby({ params: { key, location, radius: 2000, type: 'establishment' } });
  const locations = res.data.results
    .map((r) => formatNearbyLocations(r))
    .filter(
      (r) =>
        (r.types?.length === 3 && !r.types.every((t) => logding.includes(t))) ||
        (r.types?.length === 2 && !r.types.every((t) => locality.includes(t))) ||
        (r.types?.length || 0) > 3
    );
  const distances = await calculateDistance(
    [location],
    locations.map((l) => l.geoLocation!)
  );
  if (!distances) return;
  const result = locations.map((location, i) => ({
    name: location.name!,
    distance: distances[i].distance.text,
  }));
  return result;
};
