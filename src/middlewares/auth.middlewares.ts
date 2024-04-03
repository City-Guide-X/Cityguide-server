import { NextFunction, Request, Response } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user) return res.status(401).json({ message: 'User not authenticated' });
  return next();
};

export const userOnly = (req: Request, res: Response, next: NextFunction) => {
  const { type } = res.locals.user;
  if (type !== 'USER') return res.status(403).json({ message: 'Invalid Operation' });
  return next();
};

export const establishmentOnly = (req: Request, res: Response, next: NextFunction) => {
  const { type } = res.locals.user;
  if (type !== 'ESTABLISHMENT') return res.status(403).json({ message: 'Invalid Operation' });
  return next();
};
