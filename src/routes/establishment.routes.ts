import { createEstablishmentHandler, loginEstablishmentHandler } from '@controllers';
import { validateSchema } from '@middlewares';
import { createEstablishmentSchema, loginEstablishmentSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.post('/signup', validateSchema(createEstablishmentSchema), createEstablishmentHandler);
router.post('/login', validateSchema(loginEstablishmentSchema), loginEstablishmentHandler);

export default router;
