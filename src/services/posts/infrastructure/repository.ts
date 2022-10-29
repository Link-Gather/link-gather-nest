import { Injectable } from '@nestjs/common';
import { Repository } from '../../../libs/ddd';
import { Post } from '../domain/model';

@Injectable()
export class PostRepository extends Repository<Post, Post['id']> {
  entityClass = Post;

  async findByTitle(title: string) {
    return this.getManager().findOneBy(Post, {
      title,
    });
  }
}
