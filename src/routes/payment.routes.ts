import { exchangeRateHandler, getBanksHandler, getCurrenciesHandler, initiatePaymentHandler } from '@controllers';
import { requireAuth, validateSchema } from '@middlewares';
import { exchangeRateSchema, getBanksSchema, initiatePaymentSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.use(requireAuth);
router.post('/initiate', validateSchema(initiatePaymentSchema), initiatePaymentHandler);
router.get('/exchange-rate', validateSchema(exchangeRateSchema), exchangeRateHandler);
router.get('/banks', validateSchema(getBanksSchema), getBanksHandler);
router.get('/currencies', getCurrenciesHandler);

export default router;
