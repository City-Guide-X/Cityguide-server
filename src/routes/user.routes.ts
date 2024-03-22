import { createUserHandler, loginUserHandler } from '@controllers';
import { validateSchema } from '@middlewares';
import { createUserSchema, loginUserSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.post('/signup', validateSchema(createUserSchema), createUserHandler);
router.post('/login', validateSchema(loginUserSchema), loginUserHandler);

export default router;
