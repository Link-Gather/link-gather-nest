import { Module } from '@nestjs/common';
import { ProjectRepository } from './infrastructure/repository';
import { ProjectController } from './presentation/controller';
import { ProjectService } from './application/service';
import { RoleRepository } from '../roles/infrastructure/repository';
import { RoleService } from '../roles/application/service';
import { UserService } from '../users/application/service';

@Module({
  imports: [],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository, UserService, RoleService, RoleRepository],
})
export class ProjectModule {}
