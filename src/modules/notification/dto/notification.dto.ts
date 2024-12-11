import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

import { generateEnumValidationMessage } from '../../../helper/helper.service';
import { PaginationDto } from '../../../shared/dto/pagination.dto';
import {
  NotificationActionType,
  NotificationLevel,
  NotificationType,
} from '../enum/notification.enum';

export class CreateNotificationDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsEnum(NotificationLevel, {
    message: generateEnumValidationMessage(NotificationLevel, 'Level'),
  })
  level: NotificationLevel;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(NotificationType, {
    message: generateEnumValidationMessage(NotificationType, 'Notification Type'),
  })
  type: NotificationType;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  action: {
    type: NotificationActionType;
    payload: any;
  };
}

export class GetAllNotificationDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(NotificationLevel, {
    message: generateEnumValidationMessage(NotificationLevel, 'Level'),
  })
  level: NotificationLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value === 'true' ? true : false))
  isRead: boolean;

  userId: string;
}
