import { Injectable } from '@nestjs/common';
import { convertOptions, FindOrder, In, PaginationOption } from '../../../libs/orm';
import { Repository } from '../../../libs/ddd';
import { JobType, Profile, ProviderType, User } from '../domain/model';
import { stripUndefined } from '../../../libs/common';

@Injectable()
export class UserRepository extends Repository<User, User['id']> {
  entityClass = User;

  async find(
    conditions: { email?: string; profiles?: { jobs?: JobType[] }; provider?: ProviderType },
    options?: PaginationOption,
    order?: FindOrder,
  ): Promise<User[]> {
    return this.getManager().find(User, {
      where: {
        ...stripUndefined({
          email: conditions.email,
          profiles: {
            job: In(conditions.profiles?.jobs),
          },
          provider: conditions.provider,
        }),
      },
      ...convertOptions(options),
      ...order,
    });
  }

  async findProfiles() {
    return this.getManager().find(Profile, {});
  }
}
