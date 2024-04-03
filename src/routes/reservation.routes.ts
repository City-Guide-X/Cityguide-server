import { createReservationHandler, getReservationsHandler, updateReservationHandler } from '@controllers';
import { requireAuth, userOnly, validateSchema } from '@middlewares';
import { createReservationSchema, updateReservationSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.use(requireAuth);
router.get('/', getReservationsHandler);
router.post('/create', userOnly, validateSchema(createReservationSchema), createReservationHandler);
router.patch('/update', validateSchema(updateReservationSchema), updateReservationHandler);

export default router;
