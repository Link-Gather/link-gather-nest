import { Injectable } from '@nestjs/common';
import { convertOptions, FindOrder, PaginationOption } from '../../../libs';
import { Repository } from '../../../libs/ddd';
import { User } from '../domain/model';

@Injectable()
export class UserRepository extends Repository<User, User['id']> {
  entityClass = User;

  async find(conditions: { email?: string }, options?: PaginationOption, order?: FindOrder): Promise<User[]> {
    return this.getManager().find(User, {
      where: strip({
        email: conditions.email,
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
