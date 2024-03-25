import { logoutHandler, refreshAccessTokenHandler, verifyEmailHandler } from '@controllers';
import { requireAuth, validateSchema } from '@middlewares';
import { verifyEmailSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.delete('/logout', logoutHandler);
router.use(requireAuth);
router.get('/refreshaccess', refreshAccessTokenHandler);
router.get('/verifyemail/:otp', validateSchema(verifyEmailSchema), verifyEmailHandler);

export default router;
