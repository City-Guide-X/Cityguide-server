import { getAirtimeHandler, getDataHandler, getPlansHandler } from '@controllers';
import { requireAuth, userOnly, validateSchema } from '@middlewares';
import { getAirtimeSchema, getDataSchema, getPlanSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.use(requireAuth, userOnly);
router.get('/airtime', validateSchema(getAirtimeSchema), getAirtimeHandler);
router.get('/data', validateSchema(getDataSchema), getDataHandler);
router.get('/data/:provider', validateSchema(getPlanSchema), getPlansHandler);

export default router;
