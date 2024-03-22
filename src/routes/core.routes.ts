import { logoutHandler } from '@controllers';
import { Router } from 'express';

const router = Router();

router.delete('/logout', logoutHandler);

export default router;
