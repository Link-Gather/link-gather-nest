import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../services/auth/application/service';
import { UserRepository } from '../../services/users/infrastructure/repository';
import { UserGuard } from './guard';

@Global()
@Module({
  providers: [UserGuard, JwtService, UserRepository, AuthService],
  exports: [UserGuard, JwtService, UserRepository, AuthService],
})
export class GuardModule {}
