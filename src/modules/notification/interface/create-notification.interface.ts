import { Types } from 'mongoose';

import {
  NotificationActionType,
  NotificationLevel,
  NotificationType,
} from '../enum/notification.enum';

export interface ICreateNotification {
  userId: string | Types.ObjectId | any;
  title: string;
  description: string;
  level: NotificationLevel;
  type: NotificationType;
  action: {
    type: NotificationActionType;
    payload?: any;
  };
}
