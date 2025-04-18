import { BadRequestError, NotFoundError } from '@errors';
import { privateFields } from '@models';
import {
  addAccommodationInput,
  createStayInput,
  getStayByLocationInput,
  getStayDetailInput,
  removeAccommodationInput,
  searchStayInput,
  updateAccommodationInput,
  updateStayInput,
} from '@schemas';
import {
  addAccommodation,
  calculateDistance,
  createStay,
  deleteStay,
  getAllStays,
  getPartnerStays,
  getStayById,
  getTrendingStays,
  nearbyLocations,
  removeAccommodation,
  searchStay,
  updateAccommodation,
  updateStay,
} from '@services';
import { ILatLng, PropertyType } from '@types';
import { asyncWrapper, sanitize, summarizeProperty } from '@utils';
import { Request, Response } from 'express';

export const createStayHandler = asyncWrapper(async (req: Request<{}, {}, createStayInput>, res: Response) => {
  const { id, type } = res.locals.user;
  const body = { ...req.body, partner: id, partnerType: type };
  const locations = await nearbyLocations(body.address.geoLocation);
  let data = {
    ...body,
    extraInfo: { ...body.extraInfo, neighborhood: { ...body.extraInfo?.neighborhood, locations } },
  };
  const summary = (await summarizeProperty(data)) as string;
  if (summary) data = { ...data, summary };
  const stay = await createStay(data);
  return res.status(201).json({ stay: sanitize(stay, privateFields) });
});

export const getAllStayHandler = asyncWrapper(
  async (req: Request<{}, {}, {}, getStayByLocationInput>, res: Response) => {
    const geoLocation = req.query;
    const properties = await getAllStays();
    if (geoLocation.lat && geoLocation.lng) {
      const locations = properties.map((stay) => stay.address.geoLocation);
      const stayDistances = await calculateDistance([geoLocation as ILatLng], locations);
      if (!stayDistances)
        return res.status(200).json({ count: properties.length, properties: sanitize(properties, privateFields) });
      const result = properties
        .map((property, i) => {
          const stay = {
            ...sanitize(property, privateFields),
            locationInfo: {
              distance: stayDistances[i].distance?.value || 999999999,
              distanceInWords: stayDistances[i].distance?.text || '',
              duration: stayDistances[i].duration?.text || '',
            },
          };
          return stay;
        })
        .sort((a, b) => a.locationInfo.distance - b.locationInfo.distance);
      return res.status(200).json({ count: result.length, properties: result });
    }
    return res.status(200).json({ count: properties.length, properties: sanitize(properties, privateFields) });
  }
);

export const getTrendingStaysHandler = asyncWrapper(async (req: Request, res: Response) => {
  const properties = await getTrendingStays();
  return res.status(200).json({ count: properties.length, properties: sanitize(properties, privateFields) });
});

export const getPartnerStaysHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = res.locals.user;
  const properties = await getPartnerStays(id);
  return res.status(200).json({ count: properties.length, properties: sanitize(properties, privateFields) });
});

export const getStayDetailHandler = asyncWrapper(async (req: Request<getStayDetailInput>, res: Response) => {
  const { stayId } = req.params;
  const stay = await getStayById(stayId);
  return res.status(200).json({ stay: sanitize(stay, privateFields) });
});

export const updateStayHandler = asyncWrapper(
  async (req: Request<updateStayInput['params'], {}, updateStayInput['body']>, res: Response) => {
    const { id } = res.locals.user;
    const {
      body,
      params: { stayId },
    } = req;
    const { matchedCount, modifiedCount } = await updateStay(stayId, id, body);
    if (!matchedCount) throw new NotFoundError('Stay not found');
    if (!modifiedCount) throw new BadRequestError();
    res.locals.io?.emit('update_property', { id: stayId, type: PropertyType.STAY, body });
    return res.sendStatus(204);
  }
);

export const deleteStayHandler = asyncWrapper(async (req: Request<removeAccommodationInput>, res: Response) => {
  const { id } = res.locals.user;
  const { stayId } = req.params;
  await deleteStay(stayId, id);
  res.locals.io?.emit('delete_property', { id: stayId, type: PropertyType.STAY });
  return res.sendStatus(204);
});

export const addAccommodationHandler = asyncWrapper(
  async (req: Request<addAccommodationInput['params'], {}, addAccommodationInput['body']>, res: Response) => {
    const { id } = res.locals.user;
    const {
      body,
      params: { stayId },
    } = req;
    const { modifiedCount, matchedCount } = await addAccommodation(stayId, id, body);
    if (!matchedCount) throw new NotFoundError('Stay not found');
    if (!modifiedCount) throw new BadRequestError();
    res.locals.io?.emit('stay_acc', { id: stayId, action: 'add', body });
    return res.sendStatus(204);
  }
);

export const updateAccommodationHandler = asyncWrapper(
  async (req: Request<updateAccommodationInput['params'], {}, updateAccommodationInput['body']>, res: Response) => {
    const { id } = res.locals.user;
    const {
      body,
      params: { stayId, accommodationId },
    } = req;
    await updateAccommodation(stayId, id, accommodationId, body);
    res.locals.io?.emit('stay_acc', { id: stayId, action: 'update', body });
    return res.sendStatus(204);
  }
);

export const removeAccommodationHandler = asyncWrapper(
  async (req: Request<removeAccommodationInput>, res: Response) => {
    const { id } = res.locals.user;
    const { stayId, accommodationId } = req.params;
    await removeAccommodation(stayId, id, accommodationId);
    res.locals.io?.emit('stay_acc', { id: stayId, action: 'remove', accId: accommodationId });
    return res.sendStatus(204);
  }
);

export const searchStayHandler = asyncWrapper(async (req: Request<{}, {}, {}, searchStayInput>, res: Response) => {
  const { checkin, checkout, children, count, guests, lat, lng } = req.query;
  const geoLocation = { lat, lng };
  const stays = await searchStay(checkin, checkout, !!children, guests, count);
  if (!stays.length || !lat)
    return res.status(200).json({ count: stays.length, properties: sanitize(stays, privateFields) });
  const locations = stays.map((stay) => stay.address.geoLocation);
  const stayDistances = await calculateDistance([geoLocation as ILatLng], locations);
  if (!stayDistances) return res.status(200).json({ count: stays.length, properties: sanitize(stays, privateFields) });
  const result = stays
    .map((property, i) => {
      const stay = {
        ...sanitize(property, privateFields),
        locationInfo: {
          distance: stayDistances[i].distance?.value || 999999999,
          distanceInWords: stayDistances[i].distance?.text || '',
          duration: stayDistances[i].duration?.text || '',
        },
      };
      return stay;
    })
    .sort((a, b) => a.locationInfo.distance - b.locationInfo.distance);
  return res.status(200).json({ count: result.length, properties: result });
});
