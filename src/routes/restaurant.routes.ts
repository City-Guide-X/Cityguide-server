import {
  createRestaurantHandler,
  deleteRestaurantHandler,
  getRestaurantDetailHandler,
  updateRestaurantHandler,
} from '@controllers';
import { establishmentOnly, requireAuth, validateSchema } from '@middlewares';
import {
  createRestaurantSchema,
  deleteRestaurantSchema,
  getRestaurantDetailSchema,
  updateRestaurantSchema,
} from '@schemas';
import { Router } from 'express';

const router = Router();

router.get('/:restaurantId', validateSchema(getRestaurantDetailSchema), getRestaurantDetailHandler);
router.use(requireAuth, establishmentOnly);
router.post('/', validateSchema(createRestaurantSchema), createRestaurantHandler);
router.patch('/:restaurantId', validateSchema(updateRestaurantSchema), updateRestaurantHandler);
router.delete('/:restaurantId', validateSchema(deleteRestaurantSchema), deleteRestaurantHandler);

export default router;
