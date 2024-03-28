import {
  addMenuRoomHandler,
  createEstablishmentHandler,
  getEstablishmentProfileHandler,
  loginEstablishmentHandler,
  removeMenuRoomHandler,
  updateEstablishmentHandler,
} from '@controllers';
import { requireAuth, validateSchema } from '@middlewares';
import {
  addMenuRoomSchema,
  createEstablishmentSchema,
  loginEstablishmentSchema,
  removeMenuRoomSchema,
  updateEstablishmentSchema,
} from '@schemas';
import { Router } from 'express';

const router = Router();

router.post('/signup', validateSchema(createEstablishmentSchema), createEstablishmentHandler);
router.post('/login', validateSchema(loginEstablishmentSchema), loginEstablishmentHandler);
router.use(requireAuth);
router.get('/profile', getEstablishmentProfileHandler);
router.patch('/update', validateSchema(updateEstablishmentSchema), updateEstablishmentHandler);
router.post('/menuroom', validateSchema(addMenuRoomSchema), addMenuRoomHandler);
router.delete('/menuroom/', validateSchema(removeMenuRoomSchema), removeMenuRoomHandler);

export default router;
