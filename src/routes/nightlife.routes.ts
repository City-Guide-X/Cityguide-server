import { createNightLifeHandler, getNightLifeDetailHandler } from '@controllers';
import { establishmentOnly, requireAuth, validateSchema } from '@middlewares';
import { createNightLifeSchema, getNightLifeDetailSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.get('/:nightLifeId', validateSchema(getNightLifeDetailSchema), getNightLifeDetailHandler);
router.use(requireAuth, establishmentOnly);
router.post('/', validateSchema(createNightLifeSchema), createNightLifeHandler);

export default router;
