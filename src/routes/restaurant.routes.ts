import {
  addMenuHandler,
  createRestaurantHandler,
  deleteRestaurantHandler,
  getRestaurantDetailHandler,
  updateMenuHandler,
  updateRestaurantHandler,
} from '@controllers';
import { establishmentOnly, requireAuth, validateSchema } from '@middlewares';
import {
  addMenuSchema,
  createRestaurantSchema,
  deleteRestaurantSchema,
  getRestaurantDetailSchema,
  updateMenuSchema,
  updateRestaurantSchema,
} from '@schemas';
import { Router } from 'express';

const router = Router();

router.get('/:restaurantId', validateSchema(getRestaurantDetailSchema), getRestaurantDetailHandler);
router.use(requireAuth, establishmentOnly);
router.post('/', validateSchema(createRestaurantSchema), createRestaurantHandler);
router.patch('/:restaurantId', validateSchema(updateRestaurantSchema), updateRestaurantHandler);
router.delete('/:restaurantId', validateSchema(deleteRestaurantSchema), deleteRestaurantHandler);
router.post('/:restaurantId/menu', validateSchema(addMenuSchema), addMenuHandler);
router.put('/:restaurantId/menu/:menuId', validateSchema(updateMenuSchema), updateMenuHandler);

export default router;
