import { createRestaurantHandler, deleteRestaurantHandler, getRestaurantDetailHandler } from '@controllers';
import { establishmentOnly, requireAuth, validateSchema } from '@middlewares';
import { createRestaurantSchema, deleteRestaurantSchema, getRestaurantDetailSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.get('/:restaurantId', validateSchema(getRestaurantDetailSchema), getRestaurantDetailHandler);
router.use(requireAuth, establishmentOnly);
router.post('/', validateSchema(createRestaurantSchema), createRestaurantHandler);
router.delete('/:restaurantId', validateSchema(deleteRestaurantSchema), deleteRestaurantHandler);

export default router;
