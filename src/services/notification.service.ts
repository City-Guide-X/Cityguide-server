import { BadRequestError, NotFoundError } from '@errors';
import { NotificationModel } from '@models';

export const CreateNotification = (input: Partial<Notification>) => {
  return NotificationModel.create({ ...input });
};

export const getUserNotifications = (recipient: string) => {
  return NotificationModel.find({ recipient });
};

export const readNotification = async (_id: string, recipient: string) => {
  const { matchedCount, modifiedCount } = await NotificationModel.updateOne(
    { _id, recipient },
    { $set: { isRead: true } }
  );
  if (!matchedCount) {
    const notification = await NotificationModel.findById(_id);
    if (!notification) throw new NotFoundError('Notification not found');
    if (notification.recipient) throw new BadRequestError('Notification does not belong to logged in user');
  }
  if (!modifiedCount) throw new BadRequestError('Notification not read successfully');
};
