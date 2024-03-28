import { createReservationHandler, getReservationsHandler, updateReservationHandler } from '@controllers';
import { requireAuth, validateSchema } from '@middlewares';
import { createReservationSchema, updateReservationSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.use(requireAuth);
router.get('/', getReservationsHandler);
router.post('/create', validateSchema(createReservationSchema), createReservationHandler);
router.patch('/update', validateSchema(updateReservationSchema), updateReservationHandler);

export default router;
