import { Body, Controller, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GlobalResponse } from '../../helper/response-handler/response-handler.interface';
import { UserRole } from '../../shared/enum/common.enum';
import { Auth } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/getUser.decorator';
import { RolesDecorator } from '../auth/decorators/roles.decorator';
import { UserProfileDto } from './dto/updateUser.dto';
import { IUser } from './interface/user.interface';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User Module')
@Auth()
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('profile')
  @RolesDecorator(UserRole.USER)
  updateProfile(
    @Body() userProfileDto: UserProfileDto,
    @GetUser() user: IUser,
  ): Promise<GlobalResponse> {
    return this.userService.updateProfile(user._id, userProfileDto);
  }
}
