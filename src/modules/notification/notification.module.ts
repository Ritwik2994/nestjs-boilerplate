import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { NotificationController } from './notification.controller';
import { NotificationProcessor } from './notification.processor';
import { NotificationService } from './notification.service';
import { LedgersRepository } from './repository/ledger.repository';
import { LedgerMongooseModel } from './schema/ledger.schema';

@Module({
  imports: [BullModule.registerQueue({ name: 'notifications' }), LedgerMongooseModel, UserModule],
  controllers: [NotificationController],
  providers: [NotificationService, LedgersRepository, NotificationProcessor],
  exports: [NotificationService, LedgersRepository, BullModule, NotificationProcessor],
})
export class NotificationModule {}
