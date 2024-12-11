import { UserRole } from '../../../shared/enum/common.enum';
import { IUser } from '../../user/interface/user.interface';

export type GetUserType = IUser;

export interface AccessTokenPayload {
  role: UserRole;
  email: string;
  exp?: number;
}

export interface CreateAuthTokensParams {
  email: string;
}

export interface AuthTokens {
  accessToken: string;
}
