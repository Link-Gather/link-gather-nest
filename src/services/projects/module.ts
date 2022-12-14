import { Module } from '@nestjs/common';
import { ProjectRepository } from './infrastructure/repository';
import { ProjectController } from './presentation/controller';
import { ProjectService } from './application/service';

@Module({
  imports: [],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
})
export class ProjectModule {}
