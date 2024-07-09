import {
  createReservationHandler,
  getReservationsHandler,
  reservationAnalyticsHandler,
  updateReservationHandler,
} from '@controllers';
import { partnerOnly, requireAuth, userOnly, validateSchema } from '@middlewares';
import { createReservationSchema, reservationAnalyticsSchema, updateReservationSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.use(requireAuth);
router.get('/', getReservationsHandler);
router.post('/create', userOnly, validateSchema(createReservationSchema), createReservationHandler);
router.post('/analytics', partnerOnly, validateSchema(reservationAnalyticsSchema), reservationAnalyticsHandler);
router.patch('/update', validateSchema(updateReservationSchema), updateReservationHandler);

export default router;
