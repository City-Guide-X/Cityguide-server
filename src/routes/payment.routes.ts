import { initiatePaymentHandler } from '@controllers';
import { requireAuth, validateSchema } from '@middlewares';
import { initiatePaymentSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.use(requireAuth);
router.post('/initiate', validateSchema(initiatePaymentSchema), initiatePaymentHandler);

export default router;
