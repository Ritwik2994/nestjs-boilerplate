import { Injectable } from '@nestjs/common';

import { GlobalResponse } from '../../helper/response-handler/response-handler.interface';
import { ResponseHandler } from '../../helper/response-handler/response-handler.service';
import { ResponseMessage } from '../../shared/constant/responseMessage';
import { UserProfileDto } from './dto/updateUser.dto';
import { UsersRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async updateProfile(id: string | any, userProfileDto: UserProfileDto): Promise<GlobalResponse> {
    try {
      await this.usersRepository.findOneAndUpdate({ _id: id }, { ...userProfileDto });

      return ResponseHandler.success({
        data: { message: ResponseMessage.UPDATE_SUCCESS },
      });
    } catch (error) {
      return ResponseHandler.transformError(error);
    }
  }
}
