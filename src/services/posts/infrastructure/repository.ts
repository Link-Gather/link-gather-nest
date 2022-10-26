import { EntityRepository, Repository } from 'typeorm';
import { Post } from '../domain/model';

// FIXME: EntityRepository is deprecated.
@EntityRepository(Post)
export class PostRepository extends Repository<Post> {}
