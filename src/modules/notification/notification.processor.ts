import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';

import { ICreateNotification } from './interface/create-notification.interface';
import { NotificationService } from './notification.service';

@Injectable()
@Processor('notifications')
export class NotificationProcessor {
  constructor(private readonly notificationService: NotificationService) {}

  @Process('create-notification')
  async createNotification(job: Job<ICreateNotification>): Promise<void> {
    const result = await this.notificationService.create(job.data);
    if (!result) {
      throw new Error('Failed to create notification');
    }
  }
}
