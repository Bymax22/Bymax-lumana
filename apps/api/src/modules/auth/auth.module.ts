import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { SessionAuthGuard } from './session.guard';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, SessionAuthGuard],
  exports: [AuthService]
})
export class AuthModule {}
