import { createNightLifeHandler, createRestaurantHandler, createStayHandler } from '@controllers';
import { establishmentOnly, partnerOnly, requireAuth, validateSchema } from '@middlewares';
import { createNightLifeSchema, createRestaurantSchema, createStaySchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.use(requireAuth);
router.post('/stay', partnerOnly, validateSchema(createStaySchema), createStayHandler);
router.post('/restaurant', establishmentOnly, validateSchema(createRestaurantSchema), createRestaurantHandler);
router.post('/nightlife', establishmentOnly, validateSchema(createNightLifeSchema), createNightLifeHandler);

export default router;
