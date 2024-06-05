import {
  createNightLifeHandler,
  createRestaurantHandler,
  createStayHandler,
  getNightLifeDetailHandler,
  getRestaurantDetailHandler,
  getStayDetailHandler,
} from '@controllers';
import { establishmentOnly, partnerOnly, requireAuth, validateSchema } from '@middlewares';
import {
  createNightLifeSchema,
  createRestaurantSchema,
  createStaySchema,
  getNightLifeDetailSchema,
  getRestaurantDetailSchema,
  getStayDetailSchema,
} from '@schemas';
import { Router } from 'express';

const router = Router();

router.get('/stay/:stayId', validateSchema(getStayDetailSchema), getStayDetailHandler);
router.get('/restaurant/:restaurantId', validateSchema(getRestaurantDetailSchema), getRestaurantDetailHandler);
router.get('/nightlife/:nightLifeId', validateSchema(getNightLifeDetailSchema), getNightLifeDetailHandler);
router.use(requireAuth);
router.post('/stay', partnerOnly, validateSchema(createStaySchema), createStayHandler);
router.post('/restaurant', establishmentOnly, validateSchema(createRestaurantSchema), createRestaurantHandler);
router.post('/nightlife', establishmentOnly, validateSchema(createNightLifeSchema), createNightLifeHandler);

export default router;
