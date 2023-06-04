import { Injectable } from '@nestjs/common';
import { FindOrder, PaginationOption, convertOptions, In } from '../../../libs/orm';
import { Repository } from '../../../libs/ddd';
import { Role, RoleType } from '../domain/model';
import { stripUndefined } from '../../../libs/common';
import { JobType } from '../../users/domain/model';

@Injectable()
export class RoleRepository extends Repository<Role, Role['id']> {
  entityClass = Role;

  async find(
    conditions: { type?: RoleType; jobs?: JobType[]; projectIds?: string[] },
    options?: PaginationOption,
    order?: FindOrder,
  ): Promise<Role[]> {
    return this.getManager().find(Role, {
      where: {
        ...stripUndefined({
          type: conditions.type,
          job: In(conditions.jobs),
          projectId: In(conditions.projectIds),
        }),
      },
      ...convertOptions(options),
      ...order,
    });
  }
}
