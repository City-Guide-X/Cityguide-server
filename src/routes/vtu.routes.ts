import {
  createReceiverHandler,
  createTransactionHandler,
  deleteReceiverHandler,
  getUserReceiversHandler,
  getUserTransactionsHandler,
  updateReceiverHandler,
} from '@controllers';
import { requireAuth, userOnly, validateSchema } from '@middlewares';
import { createReceiverSchema, createTransactionSchema, deleteReceiverSchema, updateReceiverSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.use(requireAuth, userOnly);
router.get('/receivers', getUserReceiversHandler);
router.post('/receivers', validateSchema(createReceiverSchema), createReceiverHandler);
router.patch('/receivers/:receiverId', validateSchema(updateReceiverSchema), updateReceiverHandler);
router.delete('/receivers/:receiverId', validateSchema(deleteReceiverSchema), deleteReceiverHandler);
router.get('/transactions', getUserTransactionsHandler);
router.post('/transactions', validateSchema(createTransactionSchema), createTransactionHandler);

export default router;
