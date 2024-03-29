import { Body, Controller, Get, Injectable, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { keyBy } from 'lodash';
import { ProfileService } from '../application/service';
import { CreateBodyDto, ListQueryDto, ListResponseDto } from '../dto';
import { UserService } from '../../users/application/service';
import { AuthGuard } from '../../../libs/auth/guard';

@Controller('profiles')
@ApiTags('Profile')
@Injectable()
export class ProfileController {
  constructor(private readonly profileService: ProfileService, private readonly userService: UserService) {}

  @Get('/')
  @ApiOperation({ summary: '프로필 목록 API', description: '프로필 목록을 리턴한다. 필터가 가능하다.' })
  async list(@Query() query: ListQueryDto): Result<Paginated<ListResponseDto[]>> {
    const { stacks, job, career, page, limit } = query;
    const { items: profiles, count } = await this.profileService.list({
      stacks,
      career,
      job,
      page,
      limit,
    });
    const users = await this.userService.list({ ids: profiles.map((profile) => profile.userId) });
    const userOf = keyBy(users, 'id');

    return {
      data: {
        items: profiles.map((profile) => {
          const user = userOf[profile.userId];
          return new ListResponseDto({
            ...profile,
            nickname: user.nickname,
            profileImage: user.profileImage,
          });
        }),
        count,
      },
    };
  }

  @Post('/')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '프로필 생성 API', description: '프로필 생성한다.' })
  async create(@Body() body: CreateBodyDto, @Req() req: Request) {
    const { user } = req.state;
    const { stacks, job, career, introduction, urls } = body;
    await this.profileService.create(
      { user },
      {
        stacks,
        job,
        career,
        introduction,
        urls,
      },
    );
  }
}
