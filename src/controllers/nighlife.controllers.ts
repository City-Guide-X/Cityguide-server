import { BadRequestError, NotFoundError } from '@errors';
import { privateFields } from '@models';
import {
  createNightLifeInput,
  deleteNightLifeInput,
  getAllNightlifeInput,
  getNightLifeDetailInput,
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
  updateNightLife,
} from '@services';
import { ILatLng } from '@types';
import { asyncWrapper, summarizeNightlife } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createNightLifeHandler = asyncWrapper(
  async (req: Request<{}, {}, createNightLifeInput>, res: Response) => {
    const { id } = res.locals.user;
    let data = { ...req.body, partner: id };
    const summary = (await summarizeNightlife(data)) as string;
    if (summary) data = { ...data, summary };
    const nightlife = await createNightLife(data);
    return res.status(201).json({ nightlife: omit(nightlife.toJSON(), privateFields) });
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
        return res.status(200).json({
          count: properties.length,
          properties: properties.map((nightlife) => omit(nightlife.toJSON(), privateFields)),
        });
      const result = properties
        .map((property, i) => {
          const nightlife = {
            ...omit(property.toJSON(), privateFields),
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
    return res.status(200).json({
      count: properties.length,
      properties: properties.map((nightlife) => omit(nightlife.toJSON(), privateFields)),
    });
  }
);

export const getTrendingNightlifesHandler = asyncWrapper(async (req: Request, res: Response) => {
  const properties = await getTrendingNightlifes();
  return res.status(200).json({
    count: properties.length,
    properties: properties.map((nightlife) => omit(nightlife, privateFields)),
  });
});

export const getPartnerNightlifesHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = res.locals.user;
  const properties = await getPartnerNightlifes(id);
  return res.status(200).json({
    count: properties.length,
    properties: properties.map((nightlife) => omit(nightlife.toJSON(), privateFields)),
  });
});

export const getNightLifeDetailHandler = asyncWrapper(async (req: Request<getNightLifeDetailInput>, res: Response) => {
  const { nightLifeId } = req.params;
  const nightlife = await getNightLifeById(nightLifeId);
  if (!nightlife) throw new NotFoundError('Night Life not found');
  return res.status(200).json({ nightlife: omit(nightlife.toJSON(), privateFields) });
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
    return res.sendStatus(204);
  }
);

export const deleteNightLifeHandler = asyncWrapper(async (req: Request<deleteNightLifeInput>, res: Response) => {
  const { id } = res.locals.user;
  const { nightLifeId } = req.params;
  await deleteNightLife(nightLifeId, id);
  return res.sendStatus(204);
});
