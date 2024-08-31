import {
  addMenuHandler,
  createRestaurantHandler,
  deleteRestaurantHandler,
  getAllRestaurantHandler,
  getPartnerRestaurantsHandler,
  getRestaurantDetailHandler,
  getTrendingRestaurantsHandlers,
  removeMenuHandler,
  searchRestaurantHandler,
  updateMenuHandler,
  updateRestaurantHandler,
} from '@controllers';
import { establishmentOnly, partnerOnly, requireAuth, validateSchema } from '@middlewares';
import {
  addMenuSchema,
  createRestaurantSchema,
  deleteRestaurantSchema,
  getAllRestautantSchema,
  getRestaurantDetailSchema,
  removeMenuSchema,
  searchRestaurantSchema,
  updateMenuSchema,
  updateRestaurantSchema,
} from '@schemas';
import { Router } from 'express';

const router = Router();

router.get('/', validateSchema(getAllRestautantSchema), getAllRestaurantHandler);
router.get('/search', validateSchema(searchRestaurantSchema), searchRestaurantHandler);
router.get('/trending', getTrendingRestaurantsHandlers);
router.get('/admin', requireAuth, partnerOnly, getPartnerRestaurantsHandler);
router.get('/:restaurantId', validateSchema(getRestaurantDetailSchema), getRestaurantDetailHandler);
router.use(requireAuth, establishmentOnly);
router.post('/', validateSchema(createRestaurantSchema), createRestaurantHandler);
router.patch('/:restaurantId', validateSchema(updateRestaurantSchema), updateRestaurantHandler);
router.delete('/:restaurantId', validateSchema(deleteRestaurantSchema), deleteRestaurantHandler);
router.post('/:restaurantId/menu', validateSchema(addMenuSchema), addMenuHandler);
router.put('/:restaurantId/menu/:menuId', validateSchema(updateMenuSchema), updateMenuHandler);
router.delete('/:restaurantId/menu/:menuId', validateSchema(removeMenuSchema), removeMenuHandler);

export default router;
