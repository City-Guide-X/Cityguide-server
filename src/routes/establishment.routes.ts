import {
  createEstablishmentHandler,
  getEstablishmentProfileHandler,
  loginEstablishmentHandler,
  updateEstablishmentHandler,
} from '@controllers';
import { establishmentOnly, requireAuth, validateSchema } from '@middlewares';
import { createEstablishmentSchema, loginEstablishmentSchema, updateEstablishmentSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.post('/signup', validateSchema(createEstablishmentSchema), createEstablishmentHandler);
router.post('/login', validateSchema(loginEstablishmentSchema), loginEstablishmentHandler);
router.use(requireAuth, establishmentOnly);
router.get('/profile', getEstablishmentProfileHandler);
router.patch('/update', validateSchema(updateEstablishmentSchema), updateEstablishmentHandler);

export default router;
