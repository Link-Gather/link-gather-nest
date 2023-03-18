import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../services/auth/application/service';
import { UserRepository } from '../../services/users/infrastructure/repository';
import { AuthGuard } from './guard';

@Global()
@Module({
  providers: [AuthGuard, JwtService, UserRepository, AuthService],
  exports: [AuthGuard, JwtService, UserRepository, AuthService],
})
export class GuardModule {}
