import {
  addAccommodationHandler,
  createStayHandler,
  deleteStayHandler,
  getAllStayHandler,
  getPartnerStaysHandler,
  getStayDetailHandler,
  getTrendingStaysHandler,
  removeAccommodationHandler,
  updateAccommodationHandler,
  updateStayHandler,
} from '@controllers';
import { partnerOnly, requireAuth, validateSchema } from '@middlewares';
import {
  addAccommodationSchema,
  createStaySchema,
  deleteStaySchema,
  getStayByLocationSchema,
  getStayDetailSchema,
  removeAccommodationSchema,
  updateAccommodationSchema,
  updateStaySchema,
} from '@schemas';
import { Router } from 'express';

const router = Router();

router.post('/', validateSchema(getStayByLocationSchema), getAllStayHandler);
router.post('/trending', validateSchema(getStayByLocationSchema), getTrendingStaysHandler);
router.get('/admin', requireAuth, partnerOnly, getPartnerStaysHandler);
router.get('/:stayId', validateSchema(getStayDetailSchema), getStayDetailHandler);
router.use(requireAuth, partnerOnly);
router.post('/create', validateSchema(createStaySchema), createStayHandler);
router.patch('/:stayId', validateSchema(updateStaySchema), updateStayHandler);
router.delete('/:stayId', validateSchema(deleteStaySchema), deleteStayHandler);
router.post('/:stayId/accommodation', validateSchema(addAccommodationSchema), addAccommodationHandler);
router.put(
  '/:stayId/accommodation/:accommodationId',
  validateSchema(updateAccommodationSchema),
  updateAccommodationHandler
);
router.delete(
  '/:stayId/accommodation/:accommodationId',
  validateSchema(removeAccommodationSchema),
  removeAccommodationHandler
);

export default router;
