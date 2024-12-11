import { Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class AbstractSchema {
  id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;
  deletedAt: Date;
}
