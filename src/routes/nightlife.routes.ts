import {
  createNightLifeHandler,
  deleteNightLifeHandler,
  getAllNightlifeHandler,
  getNightLifeDetailHandler,
  getPartnerNightlifesHandler,
  getTrendingNightlifesHandler,
  searchNightlifeHandler,
  updateNightLifeHandler,
} from '@controllers';
import { establishmentOnly, partnerOnly, requireAuth, validateSchema } from '@middlewares';
import {
  createNightLifeSchema,
  deleteNightLifeSchema,
  getAllNightlifeSchema,
  getNightLifeDetailSchema,
  searchNightlifeSchema,
  updateNightLifeSchema,
} from '@schemas';
import { Router } from 'express';

const router = Router();

router.get('/', validateSchema(getAllNightlifeSchema), getAllNightlifeHandler);
router.get('/search', validateSchema(searchNightlifeSchema), searchNightlifeHandler);
router.get('/trending', getTrendingNightlifesHandler);
router.get('/admin', requireAuth, partnerOnly, getPartnerNightlifesHandler);
router.get('/:nightLifeId', validateSchema(getNightLifeDetailSchema), getNightLifeDetailHandler);
router.use(requireAuth, establishmentOnly);
router.post('/', validateSchema(createNightLifeSchema), createNightLifeHandler);
router.patch('/:nightLifeId', validateSchema(updateNightLifeSchema), updateNightLifeHandler);
router.delete('/:nightLifeId', validateSchema(deleteNightLifeSchema), deleteNightLifeHandler);

export default router;
