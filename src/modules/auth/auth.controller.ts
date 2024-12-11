import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GlobalResponse } from '../../helper/response-handler/response-handler.interface';
import { ResponseHandler } from '../../helper/response-handler/response-handler.service';
import { IUser } from '../user/interface/user.interface';
import { Auth } from './auth.guard';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/getUser.decorator';
import { LoginDto } from './dto/login.dto';
import { UpdateCredentialsDto } from './dto/updateCredentials.dto';
import { GetUserType } from './interface/auth.interface';

@Controller('auth')
@ApiTags('Admin Auth Module')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  async adminLogin(@Body() loginDto: LoginDto): Promise<GlobalResponse> {
    return await this.authService.adminLogin(loginDto);
  }

  @Auth()
  @ApiBearerAuth()
  @Patch('admin/change-password')
  async updateCredentials(
    @GetUser() user: GetUserType,
    @Body() updateCredentials: UpdateCredentialsDto,
  ): Promise<GlobalResponse> {
    return await this.authService.updateCredentials(user, updateCredentials);
  }

  @Auth()
  @ApiBearerAuth()
  @Post('admin/logout')
  async adminLogout(@GetUser() user: GetUserType): Promise<GlobalResponse> {
    return await this.authService.adminLogout(user);
  }

  @Auth()
  @ApiBearerAuth()
  @Get('profile')
  async profile(@GetUser() user: IUser | any): Promise<GlobalResponse> {
    return ResponseHandler.success({
      data: user,
    });
  }
}
