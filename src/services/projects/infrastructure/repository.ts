import { Injectable } from '@nestjs/common';
import { Raw } from 'typeorm';
import { FindOrder, PaginationOption, convertOptions, In } from '../../../libs/orm';
import { Repository } from '../../../libs/ddd';
import { Project, PurposeType, OrderType, StatusType } from '../domain/model';
import { stripUndefined } from '../../../libs/common';
import { JobType } from '../../users/domain/model';

function getOrderOption(order?: OrderType): FindOrder {
  switch (order) {
    case 'popularity':
      return { order: { bookMarkCount: 'DESC', id: 'DESC' } };
    case 'oldest':
      return { order: { id: 'ASC' } };
    case 'latest':
    default:
      return { order: { id: 'DESC' } };
  }
}

@Injectable()
export class ProjectRepository extends Repository<Project, Project['id']> {
  entityClass = Project;

  async find(
    conditions: { stacks?: number[]; purpose?: PurposeType; job?: JobType; status?: StatusType },
    options?: PaginationOption,
    order?: OrderType,
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
      ...getOrderOption(order),
    });
  }

  async count(
    conditions: { stacks?: number[]; purpose?: PurposeType; job?: JobType; status?: StatusType },
    options?: PaginationOption,
    order?: OrderType,
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
      ...getOrderOption(order),
    });
  }
}
