import { logoutHandler, refreshAccessTokenHandler } from '@controllers';
import { requireAuth } from '@middlewares';
import { Router } from 'express';

const router = Router();

router.delete('/logout', logoutHandler);
router.use(requireAuth);
router.get('/refreshaccess', refreshAccessTokenHandler);

export default router;
