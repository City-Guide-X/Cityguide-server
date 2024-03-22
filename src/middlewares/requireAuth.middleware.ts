import { NextFunction, Request, Response } from 'express';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user) return res.sendStatus(401);
  return next();
};

export default requireAuth;
