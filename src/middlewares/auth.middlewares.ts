import { AuthorizationError } from '@errors';
import { NextFunction, Request, Response } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user) return res.status(401).json({ message: 'User not authenticated' });
  return next();
};

export const userOnly = (req: Request, res: Response, next: NextFunction) => {
  const { type } = res.locals.user;
  if (type !== 'USER') throw new AuthorizationError('Only users can perform this operation');
  return next();
};

export const establishmentOnly = (req: Request, res: Response, next: NextFunction) => {
  const { type } = res.locals.user;
  if (type !== 'ESTABLISHMENT') throw new AuthorizationError('Only establishments can perform this operation');
  return next();
};

export const partnerOnly = (req: Request, res: Response, next: NextFunction) => {
  const { isPartner } = res.locals.user;
  if (!isPartner) throw new AuthorizationError('Only partners can perform this operation');
  return next();
};
