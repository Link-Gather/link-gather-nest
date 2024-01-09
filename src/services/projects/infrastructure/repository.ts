import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';
import { FindOrder, PaginationOption, convertOptions, In } from '@libs/orm';
import { Repository } from '@libs/ddd';
import { stripUndefined } from '@libs/common';
import { Project, PurposeType, OrderType, StatusType } from '../domain/model';
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
    conditions: { stacks?: string[]; purpose?: PurposeType; job?: JobType; status?: StatusType },
    options?: PaginationOption,
    order?: OrderType,
  ): Promise<Project[]> {
    const { skip, take } = convertOptions(options);
    const queryBuilder = this.getQuery(conditions);

    if (order) {
      const orderBy = getOrderOption(order);

      Object.entries(orderBy.order).forEach(([key, value]) => {
        queryBuilder.addOrderBy(`project.${key}`, value);
      });
    }

    const projects = await queryBuilder.skip(skip).take(take).getMany();
    return this.getManager().find(Project, {
      where: {
        ...stripUndefined({
          id: In(projects.map((project) => project.id)),
        }),
      },
      ...getOrderOption(order),
    });
  }

  async count(conditions: {
    stacks?: string[];
    purpose?: PurposeType;
    job?: JobType;
    status?: StatusType;
  }): Promise<number> {
    if (conditions.stacks || conditions.job) {
      return this.getQuery(conditions).getCount();
    }
    return this.getManager().count(Project, {
      where: {
        ...stripUndefined({
          purpose: conditions.purpose,
          status: conditions.status,
        }),
      },
    });
  }

  private getQuery(conditions: { stacks?: string[]; purpose?: PurposeType; job?: JobType; status?: StatusType }) {
    const queryBuilder = this.getManager().createQueryBuilder(Project, 'project');
    if (conditions.stacks) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          conditions.stacks!.forEach((stack) => {
            // NOTE: stacks 끼리는 OR 연산
            qb.orWhere(
              new Brackets((qb) => {
                qb.orWhere(`JSON_CONTAINS(project.stacks, '[${stack}]')`);
              }),
            );
          });
        }),
      );
    }

    // TODO: 지금은 선택한 직무를 포함하고 있는 프로젝트 모두 노출이지만 인원이 다 차지 않은 프로젝트만 노출되도록 수정해야 함.
    if (conditions.job) {
      queryBuilder.andWhere(`JSON_EXTRACT(project.recruitMember,  '$.${conditions.job}') >= 1`);
    }

    const strippedConditions = {
      ...stripUndefined({
        purpose: conditions.purpose,
        status: conditions.status,
      }),
    };

    Object.entries(strippedConditions).map(([key, value]) =>
      queryBuilder.andWhere(`${key} IN (:${key})`, { [key]: value }),
    );
    return queryBuilder;
  }
}
