import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from '../dto/createPostDto';
import { PostRepository } from '../infrastructure/repository';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository) private postRepository: PostRepository,
  ) {}

  async create(createPostDto: CreatePostDto) {
    return this.postRepository.save(createPostDto);
  }

  async findByTitle(title: string) {
    return this.postRepository.findByTitle(title);
  }
}
