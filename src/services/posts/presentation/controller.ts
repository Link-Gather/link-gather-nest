import { Body, Controller, Get, Injectable, Post, Query } from '@nestjs/common';
import { PostService } from '../application/service';
import { CreatePostDto } from '../dto/create-post-dto';

@Controller('post')
@Injectable()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get('/')
  get(@Query('title') title: string) {
    return this.postService.findByTitle(title);
  }
}
