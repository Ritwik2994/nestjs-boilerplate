import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

import { extendBaseSchema } from '../../../db/base.schema';
import {
  NotificationActionType,
  NotificationLevel,
  NotificationType,
} from '../enum/notification.enum';
import { ILedger } from '../interface/ledger.interface';

export const LEDGER_MONGOOSE_PROVIDER = 'ledger_mongoose_module';
export const LEDGER_COLLECTION_NAME = 'ledger';

const LedgerSchema = extendBaseSchema(
  new Schema<ILedger>(
    {
      userId: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      level: {
        type: Number,
        default: NotificationLevel.SUCCESS,
        required: true,
      },
      type: {
        type: String,
        enum: Object.values(NotificationType),
        required: true,
      },
      action: {
        type: {
          type: String,
          enum: Object.values(NotificationActionType),
          required: true,
        },
        payload: { type: Schema.Types.Mixed, required: false },
      },
      isRead: { type: Boolean, default: false },
      readAt: { type: Date, required: false },
      isDeleted: { type: Boolean, default: false },
    },
    {
      timestamps: true,
      versionKey: false,
    },
  ),
);

LedgerSchema.index({ userId: 1, isRead: 1 });

export { LedgerSchema };

export const LedgerMongooseModel = MongooseModule.forFeature([
  {
    name: LEDGER_MONGOOSE_PROVIDER,
    schema: LedgerSchema,
    collection: LEDGER_COLLECTION_NAME,
  },
]);
