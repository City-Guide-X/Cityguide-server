import {
  findEstablishmentById,
  findUserById,
  setEstablishmentRefreshToken,
  setUserRefreshToken,
  signTokens,
} from '@services';
import { IPayload } from '@types';
import { log, verifyJWT } from '@utils';
import { Request, Response } from 'express';
import { isEqual } from 'lodash';
import { string } from 'zod';

export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response
) => {
  const { id, type } = res.locals.user;
  const user =
    type === 'USER' ? await findUserById(id) : await findEstablishmentById(id);
  if (!user) return res.sendStatus(403);
  const decoded = verifyJWT<IPayload>(user?.refreshToken as string, 'refresh');
  if (!decoded || id !== decoded.id) return res.sendStatus(403);
  const { accessToken } = signTokens({
    id: user._id.toString(),
    type,
    token: 'access',
  });
  return res.status(200).json({ accessToken });
};

export const logoutHandler = async (req: Request, res: Response) => {
  const { id, type } = res.locals.user;
  const user =
    type === 'USER' ? await findUserById(id) : await findEstablishmentById(id);
  if (!user) return res.sendStatus(204);
  if (type === 'USER') await setUserRefreshToken(id, null);
  else await setEstablishmentRefreshToken(id, null);
  return res.sendStatus(204);
};

export const notFoundHandler = (req: Request, res: Response) => {
  return res.status(404).json({ message: "This route doesn't exist" });
};
