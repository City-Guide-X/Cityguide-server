import {
  addAccommodationHandler,
  createStayHandler,
  getStayDetailHandler,
  removeAccommodationHandler,
  updateAccommodationHandler,
} from '@controllers';
import { partnerOnly, requireAuth, validateSchema } from '@middlewares';
import {
  addAccommodationSchema,
  createStaySchema,
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

export default router;
