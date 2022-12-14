import { Injectable } from '@nestjs/common';
import { convertOptions, FindOrder, PaginationOption } from '../../../libs/orm';
import { Repository } from '../../../libs/ddd';
import { Project } from '../domain/model';
import { stripUndefined } from '../../../libs/common';

@Injectable()
export class ProjectRepository extends Repository<Project, Project['id']> {
  entityClass = Project;

  async find(conditions: { title?: string }, options?: PaginationOption, order?: FindOrder): Promise<Project[]> {
    return this.getManager().find(Project, {
      where: {
        ...stripUndefined({
          title: conditions.title,
        }),
      },
      ...convertOptions(options),
      ...order,
    });
  }
}
