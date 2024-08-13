import { createReviewHandler, deleteReviewHandler, getPropertyReviewsHandler } from '@controllers';
import { requireAuth, userOnly, validateSchema } from '@middlewares';
import { createReviewSchema, deleteReviewSchema, getPropertyReviewSchema } from '@schemas';
import { Router } from 'express';

const router = Router();
router.use(userOnly);
router.get('/:propertyId', validateSchema(getPropertyReviewSchema), getPropertyReviewsHandler);
router.use(requireAuth);
router.post('/', validateSchema(createReviewSchema), createReviewHandler);
router.delete('/:reviewId', validateSchema(deleteReviewSchema), deleteReviewHandler);

export default router;
