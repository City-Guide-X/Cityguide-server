import {
  findEstablishmentById,
  findUserById,
  setEstablishmentRefreshToken,
  setUserRefreshToken,
} from '@services';
import { log } from '@utils';
import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response) => {
  return res.status(404).json({ message: "This route doesn't exist" });
};

export const logoutHandler = async (req: Request, res: Response) => {
  const { id, type } = res.locals.user;
  log.info(id);
  log.info(type);
  const user =
    type === 'USER' ? await findUserById(id) : await findEstablishmentById(id);
  if (!user) return res.sendStatus(204);
  if (type === 'USER') await setUserRefreshToken(id, null);
  else await setEstablishmentRefreshToken(id, null);
  return res.sendStatus(204);
};
