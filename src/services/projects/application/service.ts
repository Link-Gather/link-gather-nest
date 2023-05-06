import { Injectable } from '@nestjs/common';
import { CreateBodyDto } from '../dto';
import { ProjectRepository } from '../infrastructure/repository';
import { Project } from '../domain/model';
import { Transactional } from '../../../libs/orm/transactional';
import { User } from '../../users/domain/model';
import { Role } from '../../roles/domain/model';
import { RoleRepository } from '../../roles/infrastructure/repository';

@Injectable()
export class ProjectService {
  constructor(private projectRepository: ProjectRepository, private roleRepository: RoleRepository) {}

  @Transactional()
  async create({ user }: { user: User }, args: CreateBodyDto) {
    const project = new Project({
      title: args.title,
      description: args.description,
      recruitMember: args.recruitMember,
      stacks: args.stacks,
      period: args.period,
      purpose: args.purpose,
    });
    const role = new Role({
      userId: user.id,
      projectId: project.id,
      type: 'Leader',
      job: args.leaderJob,
    });
    await Promise.all([this.projectRepository.save([project]), this.roleRepository.save([role])]);
    return project;
  }
}
