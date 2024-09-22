import { object, string, TypeOf } from 'zod';

export const readNotificationSchema = object({
  body: object({
    notificationIds: string({ required_error: 'Notification Ids is required' })
      .array()
      .min(1, 'Notification Ids should contain atleast 1 ID'),
  }),
});

export type readNotificationInput = TypeOf<typeof readNotificationSchema>['body'];
