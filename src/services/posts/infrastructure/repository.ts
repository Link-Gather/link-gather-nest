import { convertOptions, FindOrder, PaginationOption } from '../../../libs';
import { Repository } from '../../../libs/ddd';
import { CustomRepository } from '../../../libs/orm';
import { Post } from '../domain/model';

@CustomRepository(Post)
export class PostRepository extends Repository<Post, Post['id']> {
  entityClass = Post;

  async find(conditions: { title?: string }, options?: PaginationOption, order?: FindOrder): Promise<Post[]> {
    return this.getManager().find(Post, {
      where: strip({
        title: conditions.title,
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
