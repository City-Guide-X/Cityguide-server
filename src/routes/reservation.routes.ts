import {
  cancelReservationHandler,
  createReservationHandler,
  getPartnerReservationsHandler,
  getReservationByRefHandler,
  getReservationDetailsHandler,
  getUserReservationsHandler,
  reservationAnalyticsHandler,
  updateReservationHandler,
} from '@controllers';
import { partnerOnly, requireAuth, userOnly, validateSchema } from '@middlewares';
import {
  cancelReservationSchema,
  createReservationSchema,
  getReservationDetailSchema,
  reservationAnalyticsSchema,
  reservationRefSchema,
  updateReservationSchema,
} from '@schemas';
import { Router } from 'express';

const router = Router();

router.use(requireAuth);
router.get('/', userOnly, getUserReservationsHandler);
router.get('/partner', partnerOnly, getPartnerReservationsHandler);
router.get('/:reservationId', validateSchema(getReservationDetailSchema), getReservationDetailsHandler);
router.get('/ref/:reservationRef', validateSchema(reservationRefSchema), getReservationByRefHandler);
router.post('/', userOnly, validateSchema(createReservationSchema), createReservationHandler);
router.post('/analytics', partnerOnly, validateSchema(reservationAnalyticsSchema), reservationAnalyticsHandler);
router.patch('/update', validateSchema(updateReservationSchema), updateReservationHandler);
router.patch('/cancel/:reservationId', userOnly, validateSchema(cancelReservationSchema), cancelReservationHandler);

export default router;
