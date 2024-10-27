import { BadRequestError, NotFoundError } from '@errors';
import { NotificationModel } from '@models';
import { ClientSession } from 'mongoose';

export const createNotification = async (input: Partial<Notification>, session?: ClientSession) => {
  const [notification] = await NotificationModel.create([{ ...input }], { session });
  return notification;
};

export const getUserNotifications = (recipient: string) => {
  return NotificationModel.find({ recipient });
};

export const readNotification = async (ids: string[], recipient: string) => {
  const { matchedCount, modifiedCount } = await NotificationModel.updateMany(
    { _id: { $in: ids }, recipient },
    { $set: { isRead: true } }
  );
  if (matchedCount !== ids.length) {
    const notifications = await NotificationModel.find({ _id: { $in: ids } }, { recipient: 1 }).lean();
    if (notifications.length < ids.length) throw new NotFoundError('Not all notifications found');
    const invalidNotifications = notifications.filter((n) => n.recipient.toString() !== recipient);
    if (invalidNotifications.length > 0)
      throw new BadRequestError('Some notifications do not belong to the logged-in user');
  }
  if (modifiedCount !== matchedCount) throw new BadRequestError('Some notifications were not read successfully');
};
