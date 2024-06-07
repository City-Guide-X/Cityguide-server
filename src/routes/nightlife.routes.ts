import { createNightLifeHandler, getNightLifeDetailHandler, updateNightLifeHandler } from '@controllers';
import { establishmentOnly, requireAuth, validateSchema } from '@middlewares';
import { createNightLifeSchema, getNightLifeDetailSchema, updateNightLifeSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.get('/:nightLifeId', validateSchema(getNightLifeDetailSchema), getNightLifeDetailHandler);
router.use(requireAuth, establishmentOnly);
router.post('/', validateSchema(createNightLifeSchema), createNightLifeHandler);
router.patch('/:nightLifeId', validateSchema(updateNightLifeSchema), updateNightLifeHandler);

export default router;
