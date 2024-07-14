import {
  changePasswordHandler,
  deleteAccountHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  sendVerifyEmailHandler,
  uploadImageHandler,
  verifyEmailHandler,
} from '@controllers';
import { requireAuth, validateSchema } from '@middlewares';
import { changePasswordSchema, refreshAccessTokenSchema, verifyEmailSchema } from '@schemas';
import { parser } from '@utils';
import { Router } from 'express';

const router = Router();

router.delete('/logout', logoutHandler);
router.post('/refreshaccess', validateSchema(refreshAccessTokenSchema), refreshAccessTokenHandler);
router.use(requireAuth);
router.get('/verifyemail/:otp', validateSchema(verifyEmailSchema), verifyEmailHandler);
router.get('/sendverificationemail', sendVerifyEmailHandler);
router.post('/changepassword/:otp', validateSchema(changePasswordSchema), changePasswordHandler);
router.post('/upload', parser.array('images', 10), uploadImageHandler);
router.delete('/delete', deleteAccountHandler);

export default router;
