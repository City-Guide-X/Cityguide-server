import {
  corsCredentials,
  corsOptions,
  deserializeUser,
  errorHandler,
} from '@middlewares';
import { establishmentRoutes, userRoutes } from '@routes';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { notFoundHandler } from './controllers/misc.controllers';

const app = express();

// MIDDLEWARES
app.use(helmet());
app.use(corsCredentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(deserializeUser);

// ROUTERS
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/establishment', establishmentRoutes);
app.use('*', notFoundHandler);

app.use(errorHandler);

export default app;
