import { Document, Types } from 'mongoose';

import {
  NotificationActionType,
  NotificationLevel,
  NotificationType,
} from '../enum/notification.enum';

export interface ILedger extends Document {
  userId: Types.ObjectId | string;
  title: string;
  description: string;
  level: NotificationLevel;
  type: NotificationType;
  action: NotificationAction;
  isRead: boolean;
  readAt: Date;
  isDeleted: boolean;
}

interface NotificationAction {
  type: NotificationActionType;
  payload?: NotificationActionPayload;
}

interface NavigatePayload {
  route: string;
  params?: Record<string, string | number>;
}

interface ApiCallPayload {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, any>;
}

export type NotificationActionPayload = NavigatePayload | ApiCallPayload;
