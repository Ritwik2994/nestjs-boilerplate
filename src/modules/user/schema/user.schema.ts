import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

import { extendBaseSchema } from '../../../db/base.schema';
import { IUser } from '../interface/user.interface';

export const USERS_MONGOOSE_PROVIDER = 'users_mongoose_module';
export const USERS_COLLECTION_NAME = 'users';

const UsersSchema = extendBaseSchema(
  new Schema<IUser>(
    {
      email: { type: String, unique: true },
      name: { type: String },
      username: { type: String },
      profileImage: { type: String },
      phone: { type: Number },
      countryCode: { type: String },
      token: { type: String },
      isActive: { type: Boolean, default: false },
      isDeleted: { type: Boolean, default: false },
    },
    {
      timestamps: true,
      versionKey: false,
    },
  ),
);

UsersSchema.index({ email: 1 });

export { UsersSchema };

export const UsersMongooseModel = MongooseModule.forFeature([
  {
    name: USERS_MONGOOSE_PROVIDER,
    schema: UsersSchema,
    collection: USERS_COLLECTION_NAME,
  },
]);
