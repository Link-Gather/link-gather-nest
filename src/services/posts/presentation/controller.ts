import { Body, Controller, Get, Injectable, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PostService } from '../application/service';
import { CreatePostDto } from '../dto/create-post-dto';

@Controller('posts')
@ApiTags('Post')
@Injectable()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  @ApiOperation({ summary: '포스트 생성', description: '포스트 생성 API' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get('/')
  @ApiOperation({ summary: '포스트 조회', description: '포스트 조회 API' })
  get(@Query('title') title: string) {
    return this.postService.findByTitle(title);
  }
}
