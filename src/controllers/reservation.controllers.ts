import { privateFields } from '@models';
import { createReservationInput, updateReservationInput } from '@schemas';
import { createReservation, findReservationById, updateReservation } from '@services';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createReservationHandler = async (req: Request<{}, {}, createReservationInput>, res: Response) => {
  const { establishment, ...data } = req.body;
  const { id, type } = res.locals.user;
  if (type === 'ESTABLISHMENT') return res.status(403).json({ message: 'Invalid Operation' });
  try {
    const reservation = await createReservation(data, establishment, id);
    res.status(201).json({ reservation: omit(reservation.toJSON(), privateFields) });
  } catch (err: any) {
    if (err.errors.establishment) return res.status(400).json({ message: 'Invalid Establishment ID' });
  }
};

export const updateReservationHandler = async (req: Request<{}, {}, updateReservationInput>, res: Response) => {
  const { id, type } = res.locals.user;
  const { id: itemId, status } = req.body;
  if (type === 'USER') return res.status(403).json({ message: 'Invalid Operation' });
  const reservation = await findReservationById(itemId);
  if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
  if (reservation.establishment.toString() !== id) return res.status(403).json({ message: 'Unauthorized' });
  const isUpdated = await updateReservation(itemId, { status });
  if (!isUpdated.modifiedCount) return res.status(400).json({ message: 'Operation failed' });
  return res.sendStatus(204);
};
