import { createRestaurantHandler, getRestaurantDetailHandler } from '@controllers';
import { establishmentOnly, requireAuth, validateSchema } from '@middlewares';
import { createRestaurantSchema, getRestaurantDetailSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.get('/:restaurantId', validateSchema(getRestaurantDetailSchema), getRestaurantDetailHandler);
router.use(requireAuth, establishmentOnly);
router.post('/', validateSchema(createRestaurantSchema), createRestaurantHandler);

export default router;
