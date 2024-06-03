import { CustomError } from '@errors';
import { log } from '@utils';
import { NextFunction, Request, Response } from 'express';

class ErrorHandler {
  public handleErrors(err: Error) {
    log.error(err);
    process.exit(1);
  }
}

export const handler = new ErrorHandler();

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'ValidationError') {
    if (err.errors?.establishment) return res.status(400).json({ message: 'Invalid Establishment ID' });
    return res.status(400).json({ message: `${err._message}: ${Object.keys(err.errors).join(', ')}` });
  }
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.serialize());
  }
  if (err.code && err.code === 11000) {
    return res.status(409).json({ message: 'User already exists' });
  }
  if (err.response?.status === 417)
    return res.status(400).json({ message: 'Try again in 120 seconds. Payment code not available' });

  return res.status(500).json({ message: 'Something went wrong. Please try again later' });
};
