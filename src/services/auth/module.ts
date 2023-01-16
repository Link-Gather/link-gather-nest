import { Module } from '@nestjs/common';
import { AuthService } from './application/service';
import { AuthController } from './presentation/controller';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
