import { Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email: string;
  username?: string;
  password: string;
  profileImage?: string;
  phone?: number;
  countryCode?: string;
  role: string;
  token?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}
