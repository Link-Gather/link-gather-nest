import { Injectable } from '@nestjs/common';
import { stripUndefined } from '../../../libs/common';
import { Repository } from '../../../libs/ddd';
import { convertOptions, FindOption, FindOrder, PaginationOption } from '../../../libs/orm';
import { Verification } from '../domain/model';

@Injectable()
export class VerificationRepository extends Repository<Verification, Verification['id']> {
  entityClass = Verification;

  async find(
    conditions: { code?: string; email?: string },
    options?: PaginationOption & Partial<FindOption>,
    order?: FindOrder,
  ): Promise<Verification[]> {
    return this.getManager().find(Verification, {
      where: {
        ...stripUndefined({
          email: conditions.code,
        }),
      },
      ...convertOptions(options),
      ...order,
    });
  }
}
