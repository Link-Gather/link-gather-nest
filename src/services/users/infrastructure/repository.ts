import { Injectable } from '@nestjs/common';
import { convertOptions, FindOrder, PaginationOption } from '../../../libs/orm';
import { Repository } from '../../../libs/ddd';
import { User } from '../domain/model';
import { stripUndefined } from '../../../libs/common';

@Injectable()
export class UserRepository extends Repository<User, User['id']> {
  entityClass = User;

  async find(conditions: { email?: string }, options?: PaginationOption, order?: FindOrder): Promise<User[]> {
    return this.getManager().find(User, {
      where: {
        ...stripUndefined({
          email: conditions.email,
        }),
      },
      ...convertOptions(options),
      ...order,
    });
  }
}
