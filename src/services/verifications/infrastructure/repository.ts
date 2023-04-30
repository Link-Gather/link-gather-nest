import { Injectable } from '@nestjs/common';
import { stripUndefined } from '../../../libs/common';
import { Repository } from '../../../libs/ddd';
import { convertOptions, FindOption, FindOrder, PaginationOption } from '../../../libs/orm';
import { Verification } from '../domain/model';
import type { VerificationSpec } from '../domain/specs';

@Injectable()
export class VerificationRepository extends Repository<Verification, Verification['id']> {
  entityClass = Verification;

  async find(
    conditions: { id?: string },
    options?: PaginationOption & Partial<FindOption>,
    order?: FindOrder,
  ): Promise<Verification[]> {
    return this.getManager().find(Verification, {
      where: {
        ...stripUndefined({
          id: conditions.id,
        }),
      },
      ...convertOptions(options),
      ...order,
    });
  }

  async findSpec(spec: VerificationSpec) {
    return spec.find(this);
  }
}
