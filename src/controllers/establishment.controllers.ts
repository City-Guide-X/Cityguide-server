import { privateFields } from '@models';
import {
  addMenuItemInput,
  createEstablishmentInput,
  loginEstablishmentInput,
  removeMenuItemInput,
  updateEstablishmentInput,
} from '@schemas';
import {
  addMenuItem,
  createEstablishment,
  findEstablishmentByEmail,
  findEstablishmentById,
  removeMenuItem,
  setEstablishmentRefreshToken,
  signTokens,
  updateEstablishmentInfo,
} from '@services';
import { EstablishmentType } from '@types';
import { sendEmail } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createEstablishmentHandler = async (req: Request<{}, {}, createEstablishmentInput>, res: Response) => {
  const body = req.body;
  try {
    const establishment = await createEstablishment(body);
    await sendEmail({
      to: establishment.email,
      template: 'verificationCode',
      locals: {
        name: establishment.name,
        verifyCode: establishment.otp,
      },
    });
    const { accessToken, refreshToken } = signTokens({
      id: establishment._id.toString(),
      type: 'ESTABLISHMENT',
    });
    await setEstablishmentRefreshToken(establishment._id.toString(), refreshToken!);
    return res.status(201).json({ user: omit(establishment.toJSON(), privateFields), accessToken });
  } catch (err: any) {
    if (err.code === 11000)
      return res.status(409).json({
        message: `Establishment with ${err.keyValue.phoneNumber || err.keyValue.email} already exists`,
      });
  }
};

export const loginEstablishmentHandler = async (req: Request<{}, {}, loginEstablishmentInput>, res: Response) => {
  const { email, password } = req.body;
  const message = 'Invalid email or password';
  const establishment = await findEstablishmentByEmail(email);
  if (!establishment) return res.status(401).json({ message });
  const isEstablishment = await establishment.validatePassword(password);
  if (!isEstablishment) return res.status(401).json({ message });
  const { accessToken, refreshToken } = signTokens({
    id: establishment._id.toString(),
    type: 'ESTABLISHMENT',
  });
  await setEstablishmentRefreshToken(establishment._id.toString(), refreshToken!);
  return res.status(201).json({
    user: omit(establishment.toJSON(), privateFields),
    accessToken,
  });
};

export const updateEstablishmentHandler = async (req: Request<{}, {}, updateEstablishmentInput>, res: Response) => {
  const { id } = res.locals.user;
  const body = req.body;
  const isUpdated = await updateEstablishmentInfo(id, body);
  if (!isUpdated.modifiedCount) return res.status(400).json({ message: 'Could not updated establishment info' });
  return res.sendStatus(204);
};

export const addMenuItemHandler = async (req: Request<{}, {}, addMenuItemInput>, res: Response) => {
  const { id } = res.locals.user;
  const menu = req.body;
  const establishment = await findEstablishmentById(id);
  if (!establishment) return res.status(404).json({ message: 'Establishment not found' });
  if (establishment.type !== EstablishmentType.RESTAURANT)
    return res.status(403).json({ message: 'Invalid Operation' });
  const isUpdated = await addMenuItem(id, menu);
  if (!isUpdated.modifiedCount) return res.status(403).json({ message: 'Invalid Operation' });
  return res.sendStatus(204);
};

export const removeMenuItemHandler = async (req: Request<removeMenuItemInput>, res: Response) => {
  const { id } = res.locals.user;
  const { itemId } = req.params;
  const establishment = await findEstablishmentById(id);
  if (!establishment) return res.status(404).json({ message: 'Establishment not found' });
  if (establishment.type !== EstablishmentType.RESTAURANT)
    return res.status(403).json({ message: 'Invalid Operation' });
  const isUpdated = await removeMenuItem(id, itemId);
  if (!isUpdated.modifiedCount) return res.status(403).json({ message: 'Invalid Operation' });
  return res.sendStatus(204);
};
