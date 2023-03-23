import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getConfig } from '../../config';
import { UserRepository } from '../users/infrastructure/repository';
import { VerificationModule } from '../verifications';
import { VerificationService } from '../verifications/application/service';
import { AuthService } from './application/service';
import { AuthController } from './presentation/controller';

const JWT_SECRET = getConfig('/jwtSecret');

@Module({
  imports: [
    VerificationModule,
    JwtModule.register({
      secret: JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, VerificationService],
})
export class AuthModule {}
