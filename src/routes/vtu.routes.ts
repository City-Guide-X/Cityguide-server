import {
  createReceiverHandler,
  deleteReceiverHandler,
  getUserReceiversHandler,
  updateReceiverHandler,
} from '@controllers';
import { requireAuth, userOnly, validateSchema } from '@middlewares';
import { createReceiverSchema, deleteReceiverSchema, updateReceiverSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.use(requireAuth, userOnly);
router.get('/receivers', getUserReceiversHandler);
router.post('/receivers', validateSchema(createReceiverSchema), createReceiverHandler);
router.patch('/receivers/:receiverId', validateSchema(updateReceiverSchema), updateReceiverHandler);
router.delete('/receivers/:receiverId', validateSchema(deleteReceiverSchema), deleteReceiverHandler);

export default router;
