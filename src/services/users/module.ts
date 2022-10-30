import { Module } from '@nestjs/common';
import { UserRepository } from './infrastructure/repository';
import { UserController } from './presentation/controller';
import { UserService } from './application/service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
