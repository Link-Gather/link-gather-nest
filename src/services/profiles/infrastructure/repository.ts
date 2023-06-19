import { Injectable } from '@nestjs/common';
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
    return this.getManager().find(Profile, {
      where: {
        ...stripUndefined({
          career: conditions.career,
          job: conditions.job,
          stacks: In(conditions.stacks),
          userId: conditions.userId,
        }),
      },
      ...convertOptions(options),
      ...order,
    });
  }

  async count(
    conditions: { stacks?: number[]; career?: number; job?: JobType; userId?: string },
    options?: PaginationOption,
    order?: FindOrder,
  ): Promise<number> {
    return this.getManager().count(Profile, {
      where: {
        ...stripUndefined({
          career: conditions.career,
          job: conditions.job,
          stacks: In(conditions.stacks),
          userId: conditions.userId,
        }),
      },
      ...convertOptions(options),
      ...order,
    });
  }
}
