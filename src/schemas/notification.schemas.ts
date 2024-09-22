import { object, string, TypeOf } from 'zod';

export const readNotificationSchema = object({
  params: object({
    notificationId: string({ required_error: 'Notification ID is required' }),
  }),
});

export type readNotificationInput = TypeOf<typeof readNotificationSchema>['params'];
