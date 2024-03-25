import {
  logoutHandler,
  refreshAccessTokenHandler,
  resendVerifyEmailHandler,
  uploadImageHandler,
  verifyEmailHandler,
} from '@controllers';
import { requireAuth, validateSchema } from '@middlewares';
import { verifyEmailSchema } from '@schemas';
import { parser } from '@utils';
import { Router } from 'express';

const router = Router();

router.delete('/logout', logoutHandler);
router.use(requireAuth);
router.get('/refreshaccess', refreshAccessTokenHandler);
router.get('/verifyemail/:otp', validateSchema(verifyEmailSchema), verifyEmailHandler);
router.get('/resendverifyemail', resendVerifyEmailHandler);
router.post('/upload', parser.single('image'), uploadImageHandler);

export default router;
