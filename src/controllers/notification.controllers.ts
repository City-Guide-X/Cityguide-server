import { privateFields } from '@models';
import { readNotificationInput } from '@schemas';
import { getUserNotifications, readNotification } from '@services';
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const getUserNotificationsHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = res.locals.user;
  const notifications = await getUserNotifications(id);
  return res.status(200).json({
    count: notifications.length,
    notifications: notifications.map((notification) => omit(notification, privateFields)),
  });
});

export const readNotificationHandler = asyncWrapper(
  async (req: Request<{}, {}, readNotificationInput>, res: Response) => {
    const { id } = res.locals.user;
    const { notificationIds } = req.body;
    await readNotification(notificationIds, id);
    return res.sendStatus(204);
  }
);
