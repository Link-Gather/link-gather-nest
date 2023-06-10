import { Controller, Get, Injectable, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { keyBy } from 'lodash';
import { ProfileService } from '../application/service';
import { ListQueryDto, ListResponseDto } from '../dto';
import { UserService } from '../../users/application/service';

@Controller('profiles')
@ApiTags('Profile')
@Injectable()
export class ProfileController {
  constructor(private readonly profileService: ProfileService, private readonly userService: UserService) {}

  @Get('/')
  @ApiOperation({ summary: '프로젝트 목록 API', description: '프로젝트 목록을 리턴한다. 필터와 정렬이 가능하다.' })
  async list(@Query() query: ListQueryDto): Result<Paginated<ListResponseDto[]>> {
    const { stacks, job, page, limit } = query;
    const { items: profiles, count } = await this.profileService.list({
      stacks,
      job,
      page,
      limit,
    });
    const users = await this.userService.list({ ids: profiles.map((profile) => profile.userId) });
    const userOf = keyBy(users, 'id');

    return {
      data: {
        data: profiles.map((profile) => {
          const user = userOf[profile.userId];
          return {
            ...profile,
            nickname: user.nickname,
            profileImage: user.profileImage,
          };
        }),
        count,
      },
    };
  }
}
