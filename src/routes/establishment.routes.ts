import { createEstablishmentHandler } from '@controllers';
import { validateSchema } from '@middlewares';
import { createEstablishmentSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.post(
  '/signup',
  validateSchema(createEstablishmentSchema),
  createEstablishmentHandler
);

export default router;
