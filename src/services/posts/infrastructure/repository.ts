import { Repository } from 'typeorm';
import { CustomRepository } from '../../../libs/orm';
import { Post } from '../domain/model';

@CustomRepository(Post)
export class PostRepository extends Repository<Post> {
  async findByTitle(title: string) {
    return this.findOneBy({
      title,
    });
  }
}
