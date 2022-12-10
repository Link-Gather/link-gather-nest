import { Injectable } from '@nestjs/common';
import { FindOrder, PaginationOption, convertOptions } from '../../../libs/orm';
import { Repository } from '../../../libs/ddd';
import { Comment } from '../domain/model';
import { stripUndefined } from '../../../libs/common';

@Injectable()
export class CommentRepository extends Repository<Comment, Comment['id']> {
  entityClass = Comment;

  async find(conditions: { projectId: string }, options?: PaginationOption, order?: FindOrder): Promise<Comment[]> {
    return this.getManager().find(Comment, {
      where: {
        ...stripUndefined({
          projectId: conditions.projectId,
        }),
      },
      ...convertOptions(options),
      ...order,
    });
  }
}
