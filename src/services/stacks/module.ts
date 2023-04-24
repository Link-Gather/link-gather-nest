import { Module } from '@nestjs/common';
import { StackRepository } from './infrastructure/repository';
import { StackController } from './presentation/controller';
import { StackService } from './application/service';

@Module({
  imports: [],
  controllers: [StackController],
  providers: [StackService, StackRepository],
})
export class StackModule {}
