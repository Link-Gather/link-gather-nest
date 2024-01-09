import { Injectable } from '@nestjs/common';
import { FindOrder, PaginationOption, convertOptions } from '@libs/orm';
import { Repository } from '@libs/ddd';
import { stripUndefined } from '@libs/common';
import { Bookmark } from '../domain/model';

@Injectable()
export class BookmarkRepository extends Repository<Bookmark, Bookmark['id']> {
  entityClass = Bookmark;

  async find(
    conditions: { projectId?: string; userId?: string },
    options?: PaginationOption,
    order?: FindOrder,
  ): Promise<Bookmark[]> {
    return this.getManager().find(Bookmark, {
      where: {
        ...stripUndefined({
          projectId: conditions.projectId,
          userId: conditions.userId,
        }),
      },
      ...convertOptions(options),
      ...order,
    });
  }
}
