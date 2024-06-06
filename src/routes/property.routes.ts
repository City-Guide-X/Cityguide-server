import {
  addAccommodationHandler,
  createNightLifeHandler,
  createRestaurantHandler,
  createStayHandler,
  getNightLifeDetailHandler,
  getRestaurantDetailHandler,
  getStayDetailHandler,
  removeAccommodationHandler,
  updateAccommodationHandler,
} from '@controllers';
import { establishmentOnly, partnerOnly, requireAuth, validateSchema } from '@middlewares';
import {
  addAccommodationSchema,
  createNightLifeSchema,
  createRestaurantSchema,
  createStaySchema,
  getNightLifeDetailSchema,
  getRestaurantDetailSchema,
  getStayDetailSchema,
  removeAccommodationSchema,
  updateAccommodationSchema,
} from '@schemas';
import { Router } from 'express';

const router = Router();

router.get('/stay/:stayId', validateSchema(getStayDetailSchema), getStayDetailHandler);
router.get('/restaurant/:restaurantId', validateSchema(getRestaurantDetailSchema), getRestaurantDetailHandler);
router.get('/nightlife/:nightLifeId', validateSchema(getNightLifeDetailSchema), getNightLifeDetailHandler);
router.use(requireAuth);
router.post('/stay', partnerOnly, validateSchema(createStaySchema), createStayHandler);
router.post(
  '/stay/:stayId/accommodation',
  partnerOnly,
  validateSchema(addAccommodationSchema),
  addAccommodationHandler
);
router.patch(
  '/stay/:stayId/accommodation/:accommodationId',
  partnerOnly,
  validateSchema(updateAccommodationSchema),
  updateAccommodationHandler
);
router.delete(
  '/stay/:stayId/accommodation/:accommodationId',
  partnerOnly,
  validateSchema(removeAccommodationSchema),
  removeAccommodationHandler
);
router.post('/restaurant', establishmentOnly, validateSchema(createRestaurantSchema), createRestaurantHandler);
router.post('/nightlife', establishmentOnly, validateSchema(createNightLifeSchema), createNightLifeHandler);

export default router;
