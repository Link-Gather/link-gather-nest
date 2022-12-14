import { Injectable } from '@nestjs/common';
import { FindOrder, PaginationOption, convertOptions, In } from '../../../libs/orm';
import { Repository } from '../../../libs/ddd';
import { JobType, Role, RoleType } from '../domain/model';
import { stripUndefined } from '../../../libs/common';

@Injectable()
export class RoleRepository extends Repository<Role, Role['id']> {
  entityClass = Role;

  async find(
    conditions: { types: RoleType; jobs?: JobType[] },
    options?: PaginationOption,
    order?: FindOrder,
  ): Promise<Role[]> {
    return this.getManager().find(Role, {
      where: {
        ...stripUndefined({
          type: conditions.types,
          job: In(conditions.jobs),
        }),
      },
      ...convertOptions(options),
      ...order,
    });
  }
}
