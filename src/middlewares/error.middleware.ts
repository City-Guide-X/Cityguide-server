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
  log.error(err.message);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.serialize());
  }
  if (err.code && err.code === 11000) {
    return res.status(409).json('User already exists');
  }
  return res.status(500).json({ message: 'Something went wrong. Please try again later' });
};
