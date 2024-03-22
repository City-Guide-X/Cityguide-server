import { createUserHandler } from '@controllers';
import { validateSchema } from '@middlewares';
import { createUserSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.post('/signup', validateSchema(createUserSchema), createUserHandler);

export default router;
