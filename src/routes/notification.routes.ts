import { getUserNotificationsHandler, readNotificationHandler } from '@controllers';
import { requireAuth, validateSchema } from '@middlewares';
import { readNotificationSchema } from '@schemas';
import { Router } from 'express';

const router = Router();

router.use(requireAuth);
router.get('/', getUserNotificationsHandler);
router.patch('/:notificationId', validateSchema(readNotificationSchema), readNotificationHandler);

export default router;
