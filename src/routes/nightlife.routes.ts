import {
  createNightLifeHandler,
  deleteNightLifeHandler,
  getNightLifeDetailHandler,
  updateNightLifeHandler,
} from '@controllers';
import { establishmentOnly, requireAuth, validateSchema } from '@middlewares';
import {
  createNightLifeSchema,
  deleteNightLifeSchema,
  getNightLifeDetailSchema,
  updateNightLifeSchema,
} from '@schemas';
import { Router } from 'express';

const router = Router();

router.get('/:nightLifeId', validateSchema(getNightLifeDetailSchema), getNightLifeDetailHandler);
router.use(requireAuth, establishmentOnly);
router.post('/', validateSchema(createNightLifeSchema), createNightLifeHandler);
router.patch('/:nightLifeId', validateSchema(updateNightLifeSchema), updateNightLifeHandler);
router.delete('/:nightLifeId', validateSchema(deleteNightLifeSchema), deleteNightLifeHandler);

export default router;
