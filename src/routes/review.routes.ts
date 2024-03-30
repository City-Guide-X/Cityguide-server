import { createReviewHandler, deleteReviewHandler, getEstablishmentReviewsHandler } from '@controllers';
import { requireAuth, validateSchema } from '@middlewares';
import { createReviewSchema, deleteReviewSchema, getReviewSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.use(requireAuth);
router.get('/', validateSchema(getReviewSchema), getEstablishmentReviewsHandler);
router.post('/', validateSchema(createReviewSchema), createReviewHandler);
router.delete('/:reviewId', validateSchema(deleteReviewSchema), deleteReviewHandler);

export default router;
