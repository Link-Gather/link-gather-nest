import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Injectable,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { UserService } from '../application/service';
import type { JobType } from '../domain/model';
import type { SignUpBodyDto, SignInBodyDto } from '../dto';

@Controller('users')
@ApiTags('User')
@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up')
  @ApiOperation({ summary: '회원가입', description: '회원가입 API' })
  signUp(@Body() body: SignUpBodyDto): Promise<void> {
    return this.userService.signUp(body);
  }

  @Post('/sign-in')
  @ApiOperation({ summary: '로그인', description: '로그인 API' })
  async signIn(@Body() body: SignInBodyDto, @Res() res: Response) {
    const data = await this.userService.signIn(body);
    res.cookie('accessToken', `Bearer ${data.accessToken}`, { maxAge: 1000 * 60 * 60 });
    res.cookie('refreshToken', `Bearer ${data.refreshToken}`, { maxAge: 1000 * 60 * 60 * 24 * 30 });

    // HACK: controller에서 res객체에 접근하게 되면 return문으로 응답을 보낼 경우 무한 pending에 걸려서 express 방식으로 전달해주고 있다.
    res.status(200).json(data.user);
  }

  @Get('/profiles')
  async getProfiles(@Query('jobs') jobs: JobType[]) {
    const users = await this.userService.list({ profiles: { jobs } });
    const profiles = users.flatMap((user) => user.profiles);
    return profiles;
  }
}
