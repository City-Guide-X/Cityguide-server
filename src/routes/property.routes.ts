import { createClubHandler, createRestaurantHandler, createStayHandler } from '@controllers';
import { establishmentOnly, partnerOnly, requireAuth, validateSchema } from '@middlewares';
import { createClubSchema, createRestaurantSchema, createStaySchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.use(requireAuth);
router.post('/stay', partnerOnly, validateSchema(createStaySchema), createStayHandler);
router.post('/restaurant', establishmentOnly, validateSchema(createRestaurantSchema), createRestaurantHandler);
router.post('/club', establishmentOnly, validateSchema(createClubSchema), createClubHandler);

export default router;
