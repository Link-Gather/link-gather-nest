import { Injectable } from '@nestjs/common';
import { CreateBodyDto, ListQueryDto } from '../dto';
import { ProjectRepository } from '../infrastructure/repository';
import { Project } from '../domain/model';
import { Transactional } from '../../../libs/orm/transactional';
import { User } from '../../users/domain/model';
import { Role } from '../../roles/domain/model';
import { RoleRepository } from '../../roles/infrastructure/repository';

@Injectable()
export class ProjectService {
  constructor(private projectRepository: ProjectRepository, private roleRepository: RoleRepository) {}

  async list(args: ListQueryDto) {
    const [projects, count] = await Promise.all([
      this.projectRepository.find(
        {
          stacks: args.stacks,
          purpose: args.purpose,
          job: args.job,
          status: args.status,
        },
        {
          limit: Number(args.limit),
          page: Number(args.page),
        },
        args.order,
      ),
      this.projectRepository.count({
        stacks: args.stacks,
        purpose: args.purpose,
        job: args.job,
        status: args.status,
      }),
    ]);

    return { projects, count };
  }

  async retrieve(id: string) {
    return this.projectRepository.findOneOrFail(id);
  }

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

    await this.projectRepository.save([project]);

    const role = new Role({
      userId: user.id,
      projectId: project.id,
      type: 'leader',
      job: args.leaderJob,
    });
    await this.roleRepository.save([role]);

    return project;
  }
}
