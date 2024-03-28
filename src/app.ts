import {
  corsCredentials,
  corsOptions,
  deserializeUser,
  errorHandler,
  facebookStrategy,
  googleStrategy,
} from '@middlewares';
import { coreRoutes, establishmentRoutes, reservationRoutes, userRoutes } from '@routes';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';
import { notFoundHandler } from './controllers/core.controllers';

const app = express();

// MIDDLEWARES
app.use(helmet());
app.use(corsCredentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(deserializeUser);
app.use(passport.initialize());

// SOCIAL LOGIN STRATEGIES
passport.use(googleStrategy);
passport.use(facebookStrategy);

// ROUTERS
app.use('/api/v1/core', coreRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/establishment', establishmentRoutes);
app.use('/api/v1/reservation', reservationRoutes);
app.use('*', notFoundHandler);

app.use(errorHandler);

export default app;
