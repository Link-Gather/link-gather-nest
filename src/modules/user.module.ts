import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/infrastructure/repository';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../users/application/service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])], //UserRepository 등록
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
