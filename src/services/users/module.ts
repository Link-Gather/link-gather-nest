import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './infrastructure/repository';
import { UserController } from './presentation/controller';
import { UserService } from './application/service';
import { getConfig } from '../../config';
import { ProfileRepository } from '../profiles/infrastructure/repository';

const JWT_SECRET = getConfig('/jwtSecret');

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, ProfileRepository],
})
export class UserModule {}
