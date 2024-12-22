import {
  createReceiverHandler,
  createTransactionHandler,
  deleteReceiverHandler,
  getTransactionHandler,
  getUserReceiversHandler,
  getUserTransactionsHandler,
  getVTUServicesHandler,
  updateReceiverHandler,
} from '@controllers';
import { requireAuth, userOnly, validateSchema } from '@middlewares';
import {
  createReceiverSchema,
  createTransactionSchema,
  deleteReceiverSchema,
  getVTUTransactionSchema,
  updateReceiverSchema,
  vtuServicesSchema,
} from '@schemas';
import { Router } from 'express';

const router = Router();

router.use(requireAuth, userOnly);
router.get('/receivers', getUserReceiversHandler);
router.post('/receivers', validateSchema(createReceiverSchema), createReceiverHandler);
router.put('/receivers/:receiverId', validateSchema(updateReceiverSchema), updateReceiverHandler);
router.delete('/receivers/:receiverId', validateSchema(deleteReceiverSchema), deleteReceiverHandler);
router.get('/transactions', getUserTransactionsHandler);
router.get('/transactions/:transactionId', validateSchema(getVTUTransactionSchema), getTransactionHandler);
router.post('/transactions', validateSchema(createTransactionSchema), createTransactionHandler);
router.get('/services', validateSchema(vtuServicesSchema), getVTUServicesHandler);

export default router;
