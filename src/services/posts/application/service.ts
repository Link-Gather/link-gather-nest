import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post-dto';
import { PostRepository } from '../infrastructure/repository';
import { Post } from '../domain/model';
import { Transactional } from '../../../libs/orm/transactional';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  @Transactional()
  async create(createPostDto: CreatePostDto) {
    const post = new Post(createPostDto);
    await this.postRepository.save([post]);
    throw new HttpException('gg', 403);
  }

  async findByTitle(title: string) {
    return this.postRepository.find({ title });
  }
}
