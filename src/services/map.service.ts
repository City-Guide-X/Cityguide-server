import { Client } from '@googlemaps/google-maps-services-js';
import { ILatLng } from '@types';

const client = new Client({});
const key = process.env.GOOGLE_MAPS_API_KEY!;

export const calculateDistance = async (origins: ILatLng[], destinations: ILatLng[]) => {
  const res = await client.distancematrix({ params: { key, origins, destinations } });
  if (res.status !== 200) return;
  return res.data.rows[0].elements;
};
