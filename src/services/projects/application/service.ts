import { Injectable } from '@nestjs/common';
import { FindOrder } from 'libs/orm';
import { CreateBodyDto, ListQueryDto } from '../dto';
import { ProjectRepository } from '../infrastructure/repository';
import { Project, SortType } from '../domain/model';
import { Transactional } from '../../../libs/orm/transactional';
import { User } from '../../users/domain/model';
import { Role } from '../../roles/domain/model';
import { RoleRepository } from '../../roles/infrastructure/repository';

function getSort(sort?: SortType): FindOrder {
  switch (sort) {
    case 'hot':
      return { order: { bookMark: 'DESC', id: 'DESC' } };
    case 'oldest':
      return { order: { id: 'ASC' } };
    case 'latest':
    default:
      return { order: { id: 'DESC' } };
  }
}

@Injectable()
export class ProjectService {
  constructor(private projectRepository: ProjectRepository, private roleRepository: RoleRepository) {}

  async list(args: ListQueryDto) {
    const projects = await this.projectRepository.find(
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
      getSort(args.sort),
    );

    const count = await this.projectRepository.count(
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
      getSort(args.sort),
    );

    return { projects, count };
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
      type: 'Leader',
      job: args.leaderJob,
    });
    await this.roleRepository.save([role]);

    return project;
  }
}
