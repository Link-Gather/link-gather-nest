import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Repository } from '../../../libs/ddd';
import { Post } from '../domain/model';

@Injectable()
export class PostRepository extends Repository<Post, Post['id']> {
  entityClass = Post;

  @Inject('entityManager') entityManager!: EntityManager;

  async findByTitle(title: string) {
    return this.entityManager.findOneBy(Post, {
      title,
    });
  }
}
