import { Module } from '@nestjs/common';
import { ProfileRepository } from './infrastructure/repository';
import { ProfileService } from './application/service';
import { ProfileController } from './presentation/controller';
import { UserService } from '../users/application/service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository, UserService],
})
export class ProfileModule {}
