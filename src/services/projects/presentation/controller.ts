import { Body, Controller, Get, Injectable, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProjectService } from '../application/service';
import { CreateBodyDto, CreateResponseDto } from '../dto';
import { AuthGuard } from '../../../libs/auth/guard';

@Controller('projects')
@ApiTags('Project')
@Injectable()
export class ProjectController {
  constructor(private readonly postService: ProjectService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '프로젝트 생성', description: '프로젝트 생성 API' })
  async create(@Body() body: CreateBodyDto, @Req() req: Request): Result<CreateResponseDto> {
    const { user } = req.state;
    const { title, description, recruitMember, stacks, period, purpose, leaderJob } = body;
    const project = await this.postService.create(
      { user },
      { title, description, recruitMember, stacks, period, purpose, leaderJob },
    );
    const data = new CreateResponseDto(project);
    return { data };
  }

  @Get('/')
  @ApiOperation({ summary: '프로젝트 조회', description: '프로젝트 조회 API' })
  get(@Query('title') title: string) {
    return this.postService.findByTitle(title);
  }
}
