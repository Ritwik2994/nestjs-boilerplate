import { ConflictException, Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';

import { HelperService } from '../../helper/helper.service';
import { GlobalResponse } from '../../helper/response-handler/response-handler.interface';
import { ResponseHandler } from '../../helper/response-handler/response-handler.service';
import { ResponseMessage } from '../../shared/constant/responseMessage';
import { UserRole } from '../../shared/enum/common.enum';
import { IUser } from '../user/interface/user.interface';
import { UsersRepository } from '../user/repository/user.repository';
import { AuthUtils } from './auth.utils';
import { LoginDto } from './dto/login.dto';
import { UpdateCredentialsDto } from './dto/updateCredentials.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly helperService: HelperService,
    private readonly authUtils: AuthUtils,
  ) {}

  onModuleInit() {
    this.adminRegister();
  }

  async adminRegister(): Promise<void> {
    try {
      const hashedPassword: string = await this.helperService.argon2hash('Hello@2525');
      const adminData = {
        email: 'admin@fitu.com',
        username: 'admin',
        password: hashedPassword,
        role: UserRole.ADMIN,
      };
      const admin: IUser = await this.usersRepository.findOne({
        email: adminData.email,
        role: adminData.role,
      });

      if (!admin) {
        await this.usersRepository.create(adminData);
      }
    } catch (error) {
      ResponseHandler.transformError(error);
    }
  }

  async adminLogin(loginDto: LoginDto): Promise<GlobalResponse> {
    try {
      const { email, password } = loginDto;
      const admin: IUser = await this.usersRepository.findOne({ email, role: UserRole.ADMIN });

      if (!admin) throw new NotFoundException(ResponseMessage.NOT_FOUND);

      const isPasswordValid = await this.helperService.argon2verify(admin.password, password);

      if (!isPasswordValid) {
        throw new UnauthorizedException(ResponseMessage.UNAUTHORIZED);
      }

      const jwt = await this.authUtils.createAccessTokens({ email: admin.email });

      await this.usersRepository.findOneAndUpdate({ email }, { token: jwt }); //update token field of admin on login
      return ResponseHandler.success({
        data: { accessToken: jwt },
      });
    } catch (error) {
      return ResponseHandler.transformError(error);
    }
  }

  async adminLogout(userData: any): Promise<GlobalResponse> {
    try {
      const { email } = userData;
      await this.usersRepository.findOneAndUpdate({ email, role: UserRole.ADMIN }, { token: '' }); //empty token field on logout

      return ResponseHandler.success({
        data: { message: ResponseMessage.SUCCESS_MESSAGE_RESPONSE },
      });
    } catch (error) {
      return ResponseHandler.transformError(error);
    }
  }

  async updateCredentials(user: any, updateCredentialsDto: UpdateCredentialsDto): Promise<GlobalResponse> {
    try {
      const { currentPassword, newPassword } = updateCredentialsDto;
      const { email, password } = user;

      const isPasswordValid = await this.helperService.argon2verify(password, currentPassword);
      if (!isPasswordValid) {
        throw new ConflictException(ResponseMessage.PASSWORD_MISMATCH);
      }

      const hashedPassword = await this.helperService.argon2hash(newPassword);
      const updatedUser = await this.usersRepository.findOneAndUpdate({ email: email }, { password: hashedPassword });

      return ResponseHandler.success({
        data: updatedUser,
      });
    } catch (error) {
      return ResponseHandler.transformError(error);
    }
  }
}
