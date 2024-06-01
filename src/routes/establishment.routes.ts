import {
  // addMenuImgHandler,
  // addMenuRoomHandler,
  createEstablishmentHandler,
  getEstablishmentProfileHandler,
  loginEstablishmentHandler,
  // removeMenuImgHandler,
  // removeMenuRoomHandler,
  updateEstablishmentHandler,
} from '@controllers';
import { establishmentOnly, requireAuth, validateSchema } from '@middlewares';
import {
  // addMenuImgSchema,
  // addMenuRoomSchema,
  createEstablishmentSchema,
  loginEstablishmentSchema,
  // removeMenuImgSchema,
  // removeMenuRoomSchema,
  updateEstablishmentSchema,
} from '@schemas';
import { Router } from 'express';

const router = Router();

router.post('/signup', validateSchema(createEstablishmentSchema), createEstablishmentHandler);
router.post('/login', validateSchema(loginEstablishmentSchema), loginEstablishmentHandler);
router.use(requireAuth, establishmentOnly);
router.get('/profile', getEstablishmentProfileHandler);
router.patch('/update', validateSchema(updateEstablishmentSchema), updateEstablishmentHandler);
// router.post('/menuroom', validateSchema(addMenuRoomSchema), addMenuRoomHandler);
// router.delete('/menuroom/', validateSchema(removeMenuRoomSchema), removeMenuRoomHandler);
// router.post('/menuimg', validateSchema(addMenuImgSchema), addMenuImgHandler);
// router.delete('/menuimg', validateSchema(removeMenuImgSchema), removeMenuImgHandler);

export default router;
