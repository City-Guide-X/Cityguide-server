import {
  changeCancellationPolicyHandler,
  changePasswordHandler,
  deleteAccountHandler,
  getAdminAnalyticsHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  sendVerifyEmailHandler,
  uploadImageHandler,
  verifyEmailHandler,
} from '@controllers';
import { partnerOnly, requireAuth, validateSchema } from '@middlewares';
import {
  changeCancellationPolicySchema,
  changePasswordSchema,
  refreshAccessTokenSchema,
  verifyEmailSchema,
} from '@schemas';
import { parser } from '@utils';
import { Router } from 'express';

const router = Router();

router.delete('/logout', logoutHandler);
router.post('/refreshaccess', validateSchema(refreshAccessTokenSchema), refreshAccessTokenHandler);
router.use(requireAuth);
router.get('/verifyemail/:otp', validateSchema(verifyEmailSchema), verifyEmailHandler);
router.get('/sendverificationemail', sendVerifyEmailHandler);
router.post('/changepassword/:otp', validateSchema(changePasswordSchema), changePasswordHandler);
router.get('/admin', partnerOnly, getAdminAnalyticsHandler);
router.post('/upload', parser.array('images', 5), uploadImageHandler);
router.delete('/delete', deleteAccountHandler);
router.patch(
  '/cancellationpolicy',
  partnerOnly,
  validateSchema(changeCancellationPolicySchema),
  changeCancellationPolicyHandler
);

export default router;
