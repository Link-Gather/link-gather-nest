import { Body, Controller, Get, Injectable, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from 'services/users/application/service';
import { RoleService } from 'services/roles/application/service';
import { groupBy } from 'lodash';
import { ProjectService } from '../application/service';
import { CreateBodyDto, ListQueryDto, ListResponseDto, RetrieveResponseDto } from '../dto';
import { AuthGuard } from '../../../libs/auth/guard';

@Controller('projects')
@ApiTags('Project')
@Injectable()
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: '프로젝트 목록 API', description: '프로젝트 목록을 리턴한다. 필터와 정렬이 가능하다.' })
  async list(@Query() query: ListQueryDto): Result<Paginated<ListResponseDto[]>> {
    const { stacks, purpose, job, status, order, page, limit } = query;
    const { projects, count } = await this.projectService.list({
      stacks,
      purpose,
      job,
      status,
      order,
      page,
      limit,
    });

    const projectIds = projects.map((project) => project.id);

    const roles = await this.roleService.list({
      projectIds,
    });

    const userIds = roles.map((role) => role.userId);

    const users = await this.userService.list({
      ids: userIds,
    });

    const roleGroupByProjectId = groupBy(roles, 'projectId');

    const projectList = projects.map((project) => {
      const roles = roleGroupByProjectId[project.id];

      return {
        ...project,
        members: roles.map((role) => {
          const user = users.find((user) => user.id === role.userId)!;
          return {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            profileImage: user.profileImage,
            provider: user.provider,
            job: role.job,
            type: role.type,
          };
        }),
      };
    });

    const data = projectList.map((project) => new ListResponseDto(project));
    return { data: { items: data, count } };
  }

  @Get('/:id')
  @ApiOperation({ summary: '프로젝트 목록 API', description: '프로젝트 목록을 리턴한다. 필터와 정렬이 가능하다.' })
  async retrieve(@Param() param: { id: string }): Result<RetrieveResponseDto> {
    const { id } = param;
    const project = await this.projectService.retrieve(id);

    const roles = await this.roleService.list({
      projectIds: [project.id],
    });

    const userIds = roles.map((role) => role.userId);

    const users = await this.userService.list({
      ids: userIds,
    });

    const data = new RetrieveResponseDto({
      ...project,
      members: roles.map((role) => {
        const user = users.find((user) => user.id === role.userId)!;
        return {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          profileImage: user.profileImage,
          provider: user.provider,
          job: role.job,
          type: role.type,
        };
      }),
    });

    return {
      data,
    };
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
