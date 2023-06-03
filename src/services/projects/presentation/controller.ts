import { Body, Controller, Get, Injectable, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProjectService } from '../application/service';
import { CreateBodyDto, ListQueryDto, ListResponseDto } from '../dto';
import { AuthGuard } from '../../../libs/auth/guard';

@Controller('projects')
@ApiTags('Project')
@Injectable()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/')
  @ApiOperation({ summary: '프로젝트 목록 API', description: '프로젝트 목록을 리턴한다. 필터와 정렬이 가능하다.' })
  async list(@Query() query: ListQueryDto): Result<Paginated<ListResponseDto[]>> {
    const { stacks, purpose, job, status, sort, page, limit } = query;
    const { projects, count } = await this.projectService.list({
      stacks,
      purpose,
      job,
      status,
      sort,
      page,
      limit,
    });

    const data = projects.map((project) => new ListResponseDto(project));
    return { data: { data, count } };
  }

  @Post('/')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '프로젝트 생성', description: '프로젝트 생성 API' })
  async create(@Body() body: CreateBodyDto, @Req() req: Request): Promise<void> {
    const { user } = req.state;
    const { title, description, recruitMember, stacks, period, purpose, leaderJob } = body;
    await this.projectService.create(
      { user },
      { title, description, recruitMember, stacks, period, purpose, leaderJob },
    );
  }
}
