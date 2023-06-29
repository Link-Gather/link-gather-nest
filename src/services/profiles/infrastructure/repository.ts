import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';
import { Repository } from '../../../libs/ddd';
import { Profile } from '../domain/model';
import { FindOrder, In, PaginationOption, convertOptions } from '../../../libs/orm';
import { stripUndefined } from '../../../libs/common';
import { JobType } from '../../users/domain/model';

@Injectable()
export class ProfileRepository extends Repository<Profile, Profile['id']> {
  entityClass = Profile;

  async find(
    conditions: { stacks?: number[]; career?: number; job?: JobType; userId?: string },
    options?: PaginationOption,
    order?: FindOrder,
  ): Promise<Profile[]> {
    const { skip, take } = convertOptions(options);
    const queryBuilder = this.getQuery(conditions);

    if (order) {
      Object.entries(order.order).forEach(([key, value]) => {
        queryBuilder.addOrderBy(`profile.${key}`, value);
      });
    }

    const profiles = await queryBuilder.skip(skip).take(take).getMany();
    return this.getManager().find(Profile, {
      where: {
        ...stripUndefined({
          id: In(profiles.map((profile) => profile.id)),
        }),
      },
      ...order,
    });
  }

  async count(conditions: { stacks?: number[]; career?: number; job?: JobType; userId?: string }): Promise<number> {
    if (conditions.stacks) {
      return this.getQuery(conditions).getCount();
    }
    return this.getManager().count(Profile, {
      where: {
        ...stripUndefined({
          career: conditions.career,
          job: conditions.job,
          userId: conditions.userId,
        }),
      },
    });
  }

  private getQuery(conditions: { stacks?: number[]; career?: number; job?: JobType; userId?: string }) {
    const queryBuilder = this.getManager().createQueryBuilder(Profile, 'profile');
    if (conditions.stacks) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          conditions.stacks!.forEach((stack) => {
            // NOTE: stacks 끼리는 OR 연산
            qb.orWhere(
              new Brackets((qb) => {
                qb.orWhere(`JSON_CONTAINS(profile.stacks, '[${stack}]')`);
              }),
            );
          });
        }),
      );
    }

    const strippedConditions = {
      ...stripUndefined({
        career: conditions.career,
        job: conditions.job,
        userId: conditions.userId,
      }),
    };

    Object.entries(strippedConditions).map(([key, value]) =>
      queryBuilder.andWhere(`${key} IN (:${key})`, { [key]: value }),
    );
    return queryBuilder;
  }
}
