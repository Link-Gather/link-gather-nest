import { Module } from '@nestjs/common';
import { ProfileRepository } from './infrastructure/repository';

@Module({
  controllers: [],
  providers: [ProfileRepository],
})
export class ProfileModule {}
