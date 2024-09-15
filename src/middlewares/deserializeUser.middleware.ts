import { IPayload } from '@types';
import { verifyJWT } from '@utils';
import { NextFunction, Request, Response } from 'express';

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1] || '';
  if (!accessToken) return next();
  const decoded = verifyJWT<IPayload>(accessToken, 'access');
  if (decoded) res.locals.user = decoded;
  return next();
};

export default deserializeUser;
