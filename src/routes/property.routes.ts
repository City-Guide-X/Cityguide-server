import { createRestaurantHandler, createStayHandler } from '@controllers';
import { establishmentOnly, partnerOnly, requireAuth, validateSchema } from '@middlewares';
import { createRestaurantSchema, createStaySchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.use(requireAuth);
router.post('/stay', partnerOnly, validateSchema(createStaySchema), createStayHandler);
router.post('/restaurant', establishmentOnly, validateSchema(createRestaurantSchema), createRestaurantHandler);

export default router;
