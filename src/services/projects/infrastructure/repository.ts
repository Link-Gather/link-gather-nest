import { Injectable } from '@nestjs/common';
import { convertOptions, FindOrder, PaginationOption } from '../../../libs';
import { Repository } from '../../../libs/ddd';
import { Project } from '../domain/model';

@Injectable()
export class ProjectRepository extends Repository<Project, Project['id']> {
  entityClass = Project;

  async find(conditions: { title?: string }, options?: PaginationOption, order?: FindOrder): Promise<Project[]> {
    return this.getManager().find(Project, {
      where: strip({
        title: conditions.title,
      }),
      ...convertOptions(options),
      ...order,
    });
  }
}

function strip(obj: Record<string, any>) {
  return Object.keys(obj).reduce((stripped, key) => {
    if (typeof obj[key] !== 'undefined') {
      stripped[key] = obj[key];
    }
    return stripped;
  }, {} as Record<string, any>);
}
