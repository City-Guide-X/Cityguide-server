import { createStayHandler } from '@controllers';
import { partnerOnly, requireAuth, validateSchema } from '@middlewares';
import { createStaySchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.use(requireAuth);
router.post('/stay', partnerOnly, validateSchema(createStaySchema), createStayHandler);

export default router;
