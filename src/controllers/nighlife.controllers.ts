import { BadRequestError, NotFoundError } from '@errors';
import { privateFields } from '@models';
import {
  createNightLifeInput,
  deleteNightLifeInput,
  getAllNightlifeInput,
  getNightLifeDetailInput,
  searchNightlifeInput,
  updateNightLifeInput,
} from '@schemas';
import {
  calculateDistance,
  createNightLife,
  deleteNightLife,
  getAllNightlife,
  getNightLifeById,
  getPartnerNightlifes,
  getTrendingNightlifes,
  searchNightlife,
  updateNightLife,
} from '@services';
import { ILatLng, PropertyType } from '@types';
import { asyncWrapper, sanitize, summarizeNightlife } from '@utils';
import { Request, Response } from 'express';

export const createNightLifeHandler = asyncWrapper(
  async (req: Request<{}, {}, createNightLifeInput>, res: Response) => {
    const { id } = res.locals.user;
    let data = { ...req.body, partner: id };
    const summary = (await summarizeNightlife(data)) as string;
    if (summary) data = { ...data, summary };
    const nightlife = await createNightLife(data);
    return res.status(201).json({ nightlife: sanitize(nightlife, privateFields) });
  }
);

export const getAllNightlifeHandler = asyncWrapper(
  async (req: Request<{}, {}, {}, getAllNightlifeInput>, res: Response) => {
    const geoLocation = req.query;
    const properties = await getAllNightlife();
    if (geoLocation.lat && geoLocation.lng) {
      const locations = properties.map((nightlife) => nightlife.address.geoLocation);
      const nightlifeDistances = await calculateDistance([geoLocation as ILatLng], locations);
      if (!nightlifeDistances)
        return res.status(200).json({ count: properties.length, properties: sanitize(properties, privateFields) });
      const result = properties
        .map((property, i) => {
          const nightlife = {
            ...sanitize(property, privateFields),
            locationInfo: {
              distance: nightlifeDistances[i].distance?.value || 999999999,
              distanceInWords: nightlifeDistances[i].distance?.text || '',
              duration: nightlifeDistances[i].duration?.text || '',
            },
          };
          return nightlife;
        })
        .sort((a, b) => a.locationInfo.distance - b.locationInfo.distance);
      return res.status(200).json({ count: result.length, properties: result });
    }
    return res.status(200).json({ count: properties.length, properties: sanitize(properties, privateFields) });
  }
);

export const getTrendingNightlifesHandler = asyncWrapper(async (req: Request, res: Response) => {
  const properties = await getTrendingNightlifes();
  return res.status(200).json({ count: properties.length, properties: sanitize(properties, privateFields) });
});

export const getPartnerNightlifesHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = res.locals.user;
  const properties = await getPartnerNightlifes(id);
  return res.status(200).json({ count: properties.length, properties: sanitize(properties, privateFields) });
});

export const getNightLifeDetailHandler = asyncWrapper(async (req: Request<getNightLifeDetailInput>, res: Response) => {
  const { nightLifeId } = req.params;
  const nightlife = await getNightLifeById(nightLifeId);
  if (!nightlife) throw new NotFoundError('Night Life not found');
  return res.status(200).json({ nightlife: sanitize(nightlife, privateFields) });
});

export const updateNightLifeHandler = asyncWrapper(
  async (req: Request<updateNightLifeInput['params'], {}, updateNightLifeInput['body']>, res: Response) => {
    const { id } = res.locals.user;
    const {
      body,
      params: { nightLifeId },
    } = req;
    const { matchedCount, modifiedCount } = await updateNightLife(nightLifeId, id, body);
    if (!matchedCount) throw new NotFoundError('Night Life not found');
    if (!modifiedCount) throw new BadRequestError();
    res.locals.io?.emit('update_property', { id: nightLifeId, type: PropertyType.NIGHTLIFE, body });
    return res.sendStatus(204);
  }
);

export const deleteNightLifeHandler = asyncWrapper(async (req: Request<deleteNightLifeInput>, res: Response) => {
  const { id } = res.locals.user;
  const { nightLifeId } = req.params;
  await deleteNightLife(nightLifeId, id);
  res.locals.io?.emit('delete_property', { id: nightLifeId, type: PropertyType.NIGHTLIFE });
  return res.sendStatus(204);
});

export const searchNightlifeHandler = asyncWrapper(
  async (req: Request<{}, {}, {}, searchNightlifeInput>, res: Response) => {
    const { day, minAge, lat, lng, time } = req.query;
    const geoLocation = { lat, lng };
    const nightlifes = await searchNightlife(day, time, minAge);
    if (!nightlifes.length || !lat)
      return res.status(200).json({ count: nightlifes.length, properties: sanitize(nightlifes, privateFields) });
    const locations = nightlifes.map((nightlife) => nightlife.address.geoLocation);
    const nightlifeDistances = await calculateDistance([geoLocation as ILatLng], locations);
    if (!nightlifeDistances)
      return res.status(200).json({ count: nightlifes.length, properties: sanitize(nightlifes, privateFields) });
    const result = nightlifes
      .map((property, i) => {
        const nightlife = {
          ...sanitize(property, privateFields),
          locationInfo: {
            distance: nightlifeDistances[i].distance?.value || 999999999,
            distanceInWords: nightlifeDistances[i].distance?.text || '',
            duration: nightlifeDistances[i].duration?.text || '',
          },
        };
        return nightlife;
      })
      .sort((a, b) => a.locationInfo.distance - b.locationInfo.distance);
    return res.status(200).json({ count: result.length, properties: result });
  }
);
