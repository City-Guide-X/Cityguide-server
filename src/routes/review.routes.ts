import { createReviewHandler, deleteReviewHandler, getCanReviewHandler, getPropertyReviewsHandler } from '@controllers';
import { requireAuth, validateSchema } from '@middlewares';
import { canReviewSchema, createReviewSchema, deleteReviewSchema, getPropertyReviewSchema } from '@schemas';
import { Router } from 'express';

const router = Router();
router.get('/can-review', requireAuth, validateSchema(canReviewSchema), getCanReviewHandler);
router.get('/:propertyId', validateSchema(getPropertyReviewSchema), getPropertyReviewsHandler);
router.use(requireAuth);
router.post('/', validateSchema(createReviewSchema), createReviewHandler);
router.delete('/:reviewId', validateSchema(deleteReviewSchema), deleteReviewHandler);

export default router;
