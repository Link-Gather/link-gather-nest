import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getConfig } from '../../config';
import { UserRepository } from '../users/infrastructure/repository';
import { AuthService } from './application/service';
import { AuthController } from './presentation/controller';

const JWT_SECRET = getConfig('/jwtSecret');

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
