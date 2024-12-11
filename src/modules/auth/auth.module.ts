import { forwardRef, Global, Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { RestAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthUtils } from './auth.utils';

@Global()
@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [AuthService, RestAuthGuard, AuthUtils],
  controllers: [AuthController],
  exports: [RestAuthGuard, AuthUtils],
})
export class AuthModule {}
