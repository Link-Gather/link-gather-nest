import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PostService } from '../application/service';
import { CreatePostDto } from '../dto/createPostDto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  create(@Body() createPostDto: CreatePostDto): any {
    return this.postService.create(createPostDto);
  }

  @Get('/')
  get(@Query('title') title: string): any {
    return this.postService.findByTitle(title);
  }
}
