import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from '../dto/createPostDto';
import { PostRepository } from '../infrastructure/repository';
import { Post } from '../domain/model';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository) private postRepository: PostRepository,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = new Post(createPostDto);
    return this.postRepository.save([post]);
  }

  async findByTitle(title: string) {
    return this.postRepository.findByTitle(title);
  }
}
