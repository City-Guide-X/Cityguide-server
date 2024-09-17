import { CorsOptions } from 'cors';
import { NextFunction, Request, Response } from 'express';

export const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'https://cityguide-web.vercel.app/'];

export const corsCredentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req?.headers?.origin;
  if (allowedOrigins.includes(String(origin))) {
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
};

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(String(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
