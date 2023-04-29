import { Module } from '@nestjs/common';
import { ProjectRepository } from './infrastructure/repository';
import { ProjectController } from './presentation/controller';
import { ProjectService } from './application/service';
import { RoleRepository } from '../roles/infrastructure/repository';

@Module({
  imports: [],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository, RoleRepository],
})
export class ProjectModule {}
