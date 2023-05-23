import { Injectable } from '@nestjs/common';
import { Raw } from 'typeorm';
import { JobType } from '../../roles/domain/model';
import { FindOrder, PaginationOption, convertOptions, In } from '../../../libs/orm';
import { Repository } from '../../../libs/ddd';
import { Project, PurposeType, SortType, StatusType } from '../domain/model';
import { stripUndefined } from '../../../libs/common';

function getSort(sort?: SortType): FindOrder {
  switch (sort) {
    case 'Hot':
      return { order: { bookMarkCount: 'DESC', id: 'DESC' } };
    case 'Oldest':
      return { order: { id: 'ASC' } };
    case 'Latest':
    default:
      return { order: { id: 'DESC' } };
  }
}

@Injectable()
export class ProjectRepository extends Repository<Project, Project['id']> {
  entityClass = Project;

  async find(
    conditions: { stacks?: string[]; purpose?: PurposeType; job?: JobType; status?: StatusType },
    options?: PaginationOption,
    sort?: SortType,
  ): Promise<Project[]> {
    return this.getManager().find(Project, {
      where: {
        ...stripUndefined({
          stacks: In(conditions.stacks),
          purpose: conditions.purpose,
          // TODO: 지금은 선택한 직무를 포함하고 있는 프로젝트 모두 노출이지만 인원이 다 차지 않은 프로젝트만 노출되도록 수정해야 함.
          recruitMember: conditions.job
            ? Raw((alias) => `JSON_EXTRACT(${alias}, :job) >= 1`, {
                job: `$.${conditions.job}`,
              })
            : undefined,
          status: conditions.status,
        }),
      },
      ...convertOptions(options),
      ...getSort(sort),
    });
  }

  async count(
    conditions: { stacks?: string[]; purpose?: PurposeType; job?: JobType; status?: StatusType },
    options?: PaginationOption,
    sort?: SortType,
  ): Promise<number> {
    return this.getManager().count(Project, {
      where: {
        ...stripUndefined({
          stacks: In(conditions.stacks),
          purpose: conditions.purpose,
          // TODO: 지금은 선택한 직무를 포함하고 있는 프로젝트 모두 노출이지만 인원이 다 차지 않은 프로젝트만 노출되도록 수정해야 함.
          recruitMember: conditions.job
            ? Raw((alias) => `JSON_EXTRACT(${alias}, :job) >= 1`, {
                job: `$.${conditions.job}`,
              })
            : undefined,
          status: conditions.status,
        }),
      },
      ...convertOptions(options),
      ...getSort(sort),
    });
  }
}
