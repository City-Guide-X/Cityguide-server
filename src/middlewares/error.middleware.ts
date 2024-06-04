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
    return res.status(400).json({
      message: Object.keys(err.errors)
        .map((key) => `Invalid ${key[0].toUpperCase()}${key.slice(1)} ID`)
        .join(', '),
    });
  }
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.serialize());
  }
  if (err.code && err.code === 11000) {
    return res.status(409).json({
      message: `User with ${Object.entries(err.keyValue)
        .map((entry) => `${entry[0]} ${entry[1]}`)
        .join(', ')} already exists`,
    });
  }
  if (err.response?.status === 417)
    return res.status(400).json({ message: 'Try again in 120 seconds. Payment code not available' });

  return res.status(500).json({ message: 'Something went wrong. Please try again later' });
};
