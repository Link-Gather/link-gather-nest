import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Injectable,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from '../application/service';
import type { JobType } from '../domain/model';
import { SignUpBodyDto, nicknameCheckQueryDto } from '../dto';

@Controller('users')
@ApiTags('User')
@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up')
  @ApiOperation({ summary: '회원가입', description: '회원가입 API' })
  async signUp(@Body() body: SignUpBodyDto): Promise<void> {
    return this.userService.signUp(body);
  }

  @Get('/profiles')
  async getProfiles(@Query('jobs') jobs: JobType[]) {
    const users = await this.userService.list({ profiles: { jobs } });
    const profiles = users.flatMap((user) => user.profiles);
    return profiles;
  }

  @Get('/nickname-check')
  @ApiOperation({
    summary: '닉네임 중복 체크 API',
    description: '사용 불가능한 닉네임일 경우 true, 사용 가능한 닉네임일 경우 false 를 반환한다.',
  })
  isNicknameDuplicated(@Query() query: nicknameCheckQueryDto): Promise<boolean> {
    const { nickname } = query;
    return this.userService.isNicknameDuplicated({ nickname });
  }
}
