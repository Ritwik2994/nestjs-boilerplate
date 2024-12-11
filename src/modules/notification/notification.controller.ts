import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { GlobalResponse } from '@app/helper/response-handler/response-handler.interface';

import { Auth } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/getUser.decorator';
import { GetUserType } from '../auth/interface/auth.interface';
import { GetAllNotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';

@ApiTags('Notification Module')
@Controller('notification')
@Auth()
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAll(
    @Query() getAllNotificationDto: GetAllNotificationDto,
    @GetUser() user: GetUserType,
  ): Promise<GlobalResponse> {
    getAllNotificationDto.userId = (user._id as ObjectId).toString();
    return this.notificationService.findAll(getAllNotificationDto);
  }

  @Patch(':id/mark-as-read')
  markAsRead(@Param('id') id: string, @GetUser() user: GetUserType): Promise<GlobalResponse> {
    return this.notificationService.markAsRead(id, (user._id as ObjectId).toString());
  }

  @Patch('mark-all-as-read')
  markAllAsRead(@GetUser() user: GetUserType): Promise<GlobalResponse> {
    return this.notificationService.markAllAsRead((user._id as ObjectId).toString());
  }

  @Get('unread-count')
  getUnreadCount(@GetUser() user: GetUserType): Promise<GlobalResponse> {
    return this.notificationService.getUnreadCount((user._id as ObjectId).toString());
  }
}
