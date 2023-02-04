import { Body, Controller, Get, Injectable, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProjectService } from '../application/service';
import { CreateDto } from '../dto';

@Controller('projects')
@ApiTags('Project')
@Injectable()
export class ProjectController {
  constructor(private readonly postService: ProjectService) {}

  @Post('/')
  @ApiOperation({ summary: '프로젝트 생성', description: '프로젝트 생성 API' })
  create(@Body() createDto: CreateDto) {
    return this.postService.create(createDto);
  }

  @Get('/')
  @ApiOperation({ summary: '프로젝트 조회', description: '프로젝트 조회 API' })
  get(@Query('title') title: string) {
    return this.postService.findByTitle(title);
  }
}
