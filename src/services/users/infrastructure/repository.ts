import { Injectable } from '@nestjs/common';
import { convertOptions, FindOrder, In, PaginationOption } from '../../../libs/orm';
import { Repository } from '../../../libs/ddd';
import { ProviderType, User } from '../domain/model';
import { stripUndefined } from '../../../libs/common';

@Injectable()
export class UserRepository extends Repository<User, User['id']> {
  entityClass = User;

  async find(
    conditions: {
      ids?: string[];
      email?: string;
      provider?: ProviderType;
      refreshToken?: string;
      nickname?: string;
    },
    options?: PaginationOption,
    order?: FindOrder,
  ): Promise<User[]> {
    return this.getManager().find(User, {
      where: {
        ...stripUndefined({
          id: In(conditions.ids),
          email: conditions.email,
          nickname: conditions.nickname,
          provider: conditions.provider,
          refreshToken: conditions.refreshToken,
        }),
      },
      ...convertOptions(options),
      ...order,
    });
  }
}
