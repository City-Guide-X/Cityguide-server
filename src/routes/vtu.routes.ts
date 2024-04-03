import { getBillersHandler } from '@controllers';
import { requireAuth, userOnly } from '@middlewares';
import { Router } from 'express';

const router = Router();

router.use(requireAuth, userOnly);
router.get('/billers', getBillersHandler);

export default router;
