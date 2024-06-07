import {
  addAccommodationHandler,
  createStayHandler,
  deleteStayHandler,
  getStayDetailHandler,
  removeAccommodationHandler,
  updateAccommodationHandler,
  updateStayHandler,
} from '@controllers';
import { partnerOnly, requireAuth, validateSchema } from '@middlewares';
import {
  addAccommodationSchema,
  createStaySchema,
  deleteStaySchema,
  getStayDetailSchema,
  removeAccommodationSchema,
  updateAccommodationSchema,
  updateStaySchema,
} from '@schemas';
import { Router } from 'express';

const router = Router();

router.get('/:stayId', validateSchema(getStayDetailSchema), getStayDetailHandler);
router.use(requireAuth, partnerOnly);
router.post('/', validateSchema(createStaySchema), createStayHandler);
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
