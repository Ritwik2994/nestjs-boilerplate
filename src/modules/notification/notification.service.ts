import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ResponseHandler } from 'src/helper/response-handler/response-handler.service';

import { HelperService } from '../../helper/helper.service';
import { GlobalResponse } from '../../helper/response-handler/response-handler.interface';
import { ResponseMessage } from '../../shared/constant/responseMessage';
import { GetAllNotificationDto } from './dto/notification.dto';
import { ICreateNotification } from './interface/create-notification.interface';
import { LedgersRepository } from './repository/ledger.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly ledgersRepository: LedgersRepository,
    private readonly helperService: HelperService,
  ) {}

  async create(createNotification: ICreateNotification): Promise<boolean> {
    try {
      await this.ledgersRepository.create(createNotification);
      return true;
    } catch (error) {
      console.error('create', error.message);
      return false;
    }
  }

  async findAll(getAllNotificationDto: GetAllNotificationDto): Promise<GlobalResponse> {
    try {
      const { userId, limit, offset, sortField, sortOrder, isRead } = getAllNotificationDto;

      const skip = (offset - 1) * limit;
      const query: any = { userId, is_deleted: false };
      const sort = await this.helperService.buildSort(sortField, sortOrder);

      if (isRead !== undefined) {
        query['isRead'] = isRead;
      }

      const notifications = await this.ledgersRepository.fetchByPagination(query, sort, skip, limit, offset);
      notifications['hasNextPage'] = offset < notifications.totalPages;
      if (!notifications) {
        throw new NotFoundException(ResponseMessage.NOT_FOUND);
      }

      return ResponseHandler.success({
        data: notifications,
      });
    } catch (error) {
      return ResponseHandler.transformError(error);
    }
  }

  async markAsRead(id: string, userId: string): Promise<GlobalResponse> {
    try {
      await this.ledgersRepository.findOneAndUpdate(
        { _id: id, userId: new Types.ObjectId(userId) },
        { isRead: true, read_at: new Date() },
      );

      return ResponseHandler.success({
        data: { message: ResponseMessage.UPDATE_SUCCESS },
      });
    } catch (error) {
      return ResponseHandler.transformError(error);
    }
  }

  async delete(id: string): Promise<GlobalResponse> {
    try {
      const deletedData = await this.ledgersRepository.softDelete(id);
      if (deletedData) {
        throw new NotFoundException(ResponseMessage.NOT_FOUND);
      }

      return ResponseHandler.success({
        data: { message: ResponseMessage.DELETE_SUCCESS },
      });
    } catch (error) {
      return ResponseHandler.transformError(error);
    }
  }

  async markAllAsRead(userId: string): Promise<GlobalResponse> {
    try {
      const updateOperations = [
        {
          updateMany: {
            filter: { userId: new Types.ObjectId(userId), isRead: false, isDeleted: false },
            update: { $set: { isRead: true, readAt: new Date() } },
          },
        },
      ];
      const result = await this.ledgersRepository.bulkUpdate(updateOperations);

      return ResponseHandler.success({
        data: { modifiedCount: result?.modifiedCount },
      });
    } catch (error) {
      return ResponseHandler.transformError(error);
    }
  }

  async getUnreadCount(userId: string): Promise<GlobalResponse> {
    try {
      const count = await this.ledgersRepository.countDocuments({
        userId: new Types.ObjectId(userId),
        isRead: false,
        isDeleted: false,
      });

      return ResponseHandler.success({
        data: { unreadCount: count },
      });
    } catch (error) {
      return ResponseHandler.transformError(error);
    }
  }
}
