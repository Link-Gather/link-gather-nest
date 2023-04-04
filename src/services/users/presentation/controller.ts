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
import { SignUpBodyDto, SignInBodyDto, NicknameCheckQueryDto, NicknameCheckResponseDto } from '../dto';

@Controller('users')
@ApiTags('User')
@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up')
  @ApiOperation({ summary: '회원가입', description: '회원가입 API' })
  async signUp(@Body() body: SignUpBodyDto): Promise<void> {
    const { email, password, nickname, provider, career, job, introduction, stacks, urls, profileImage } = body;
    await this.userService.signUp({
      email,
      password,
      nickname,
      provider,
      career,
      job,
      introduction,
      stacks,
      urls,
      profileImage,
    });
  }

  @Post('/sign-in')
  @ApiOperation({ summary: '로그인', description: '로그인 API' })
  async signIn(@Body() body: SignInBodyDto, @Res() res: Response): Promise<void> {
    const { email, password } = body;
    const data = await this.userService.signIn({ email, password });

    res.cookie('accessToken', `Bearer ${data.accessToken}`, { maxAge: 1000 * 60 * 60 });
    res.cookie('refreshToken', `Bearer ${data.refreshToken}`, { maxAge: 1000 * 60 * 60 * 24 * 30 });

    // HACK: controller에서 res객체에 접근하게 되면 return문으로 응답을 보낼 경우 무한 pending에 걸려서 express 방식으로 전달해주고 있다.
    res.status(200).json(data.user);
  }

  @Get('/nickname-check')
  @ApiOperation({
    summary: '닉네임 중복 체크 API',
    description:
      '사용 불가능한 닉네임일 경우 { isDuplicated: true }, 사용 가능한 닉네임일 경우 { isDuplicated: false } 를 반환한다.',
  })
  async isNicknameDuplicated(@Query() query: NicknameCheckQueryDto): Promise<Result<NicknameCheckResponseDto>> {
    const { nickname } = query;
    const isDuplicated = await this.userService.isNicknameDuplicated({ nickname });

    const data = new NicknameCheckResponseDto({ isDuplicated });
    return { data };
  }
}
