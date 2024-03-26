import {
  addMenuItemHandler,
  createEstablishmentHandler,
  loginEstablishmentHandler,
  removeMenuItemHandler,
  updateEstablishmentHandler,
} from '@controllers';
import { requireAuth, validateSchema } from '@middlewares';
import {
  addMenuItemSchema,
  createEstablishmentSchema,
  loginEstablishmentSchema,
  removeMenuItemSchema,
  updateEstablishmentSchema,
} from '@schemas';
import { Router } from 'express';

const router = Router();

router.post('/signup', validateSchema(createEstablishmentSchema), createEstablishmentHandler);
router.post('/login', validateSchema(loginEstablishmentSchema), loginEstablishmentHandler);
router.use(requireAuth);
router.patch('/update', validateSchema(updateEstablishmentSchema), updateEstablishmentHandler);
router.post('/menu', validateSchema(addMenuItemSchema), addMenuItemHandler);
router.delete('/menu/:itemId', validateSchema(removeMenuItemSchema), removeMenuItemHandler);

export default router;
