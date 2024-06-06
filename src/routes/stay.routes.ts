import {
  addAccommodationHandler,
  createStayHandler,
  deleteStayHandler,
  getStayDetailHandler,
  removeAccommodationHandler,
  updateAccommodationHandler,
} from '@controllers';
import { partnerOnly, requireAuth, validateSchema } from '@middlewares';
import {
  addAccommodationSchema,
  createStaySchema,
  deleteStaySchema,
  getStayDetailSchema,
  removeAccommodationSchema,
  updateAccommodationSchema,
} from '@schemas';
import { Router } from 'express';

const router = Router();

router.get('/:stayId', validateSchema(getStayDetailSchema), getStayDetailHandler);
router.use(requireAuth, partnerOnly);
router.post('/', partnerOnly, validateSchema(createStaySchema), createStayHandler);
router.post('/:stayId/accommodation', validateSchema(addAccommodationSchema), addAccommodationHandler);
router.patch(
  '/:stayId/accommodation/:accommodationId',
  validateSchema(updateAccommodationSchema),
  updateAccommodationHandler
);
router.delete(
  '/:stayId/accommodation/:accommodationId',
  validateSchema(removeAccommodationSchema),
  removeAccommodationHandler
);
router.delete('/:stayId', validateSchema(deleteStaySchema), deleteStayHandler);

export default router;
