import {
  completePaymentHandler,
  exchangeRateHandler,
  getBanksHandler,
  getCurrenciesHandler,
  initiatePaymentHandler,
} from '@controllers';
import { requireAuth, validateSchema } from '@middlewares';
import { completePaymentSchema, exchangeRateSchema, getBanksSchema, initiatePaymentSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.get('/currencies', getCurrenciesHandler);
router.get('/exchange-rate', validateSchema(exchangeRateSchema), exchangeRateHandler);
router.get('/banks', validateSchema(getBanksSchema), getBanksHandler);
router.use(requireAuth);
router.post('/initiate', validateSchema(initiatePaymentSchema), initiatePaymentHandler);
router.post('/complete', validateSchema(completePaymentSchema), completePaymentHandler);

export default router;
