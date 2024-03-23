import { NextFunction, Request, Response } from 'express';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user)
    return res.status(401).json({ message: 'User not authenticated' });
  return next();
};

export default requireAuth;
