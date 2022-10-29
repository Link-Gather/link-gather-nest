import {
  Body,
  Controller,
  Get,
  Inject,
  Injectable,
  Post,
  Query,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { PostService } from '../application/service';
import { CreatePostDto } from '../dto/createPostDto';

@Controller('post')
@Injectable()
export class PostController {
  constructor(
    private readonly postService: PostService,
    @Inject('entityManager') private readonly manager: EntityManager,
  ) {}

  @Post('/')
  create(@Body() createPostDto: CreatePostDto): any {
    return this.postService.create(createPostDto);
  }

  @Get('/')
  get(@Query('title') title: string): any {
    console.log(this.manager, 'manager');

    return this.postService.findByTitle(title);
  }
}
