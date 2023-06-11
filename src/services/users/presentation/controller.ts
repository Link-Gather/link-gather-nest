import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Injectable,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { validate } from 'class-validator';
import { UserService } from '../application/service';
import {
  SignUpBodyDto,
  SignInBodyDto,
  NicknameCheckQueryDto,
  NicknameCheckResponseDto,
  SignInResponseDto,
  RetrieveResponseDto,
} from '../dto';
import { badRequest } from '../../../libs/exception';
import { AuthGuard } from '../../../libs/auth/guard';

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

    res.cookie('accessToken', `Bearer ${data.accessToken}`, { maxAge: 1000 * 60 * 60, signed: true });
    res.cookie('refreshToken', `Bearer ${data.refreshToken}`, { maxAge: 1000 * 60 * 60 * 24 * 30, signed: true });

    const user = new SignInResponseDto({
      id: data.user.id,
      email: data.user.email,
      nickname: data.user.nickname,
      provider: data.user.provider,
      profileImage: data.user.profileImage,
      nicknameUpdatedOn: data.user.nicknameUpdatedOn,
    });

    const errors = await validate(user);

    if (errors.length > 0) {
      const messege = errors.map((error) => error.constraints);
      throw badRequest(JSON.stringify(messege), {
        errorMessage: '유저 정보가 올바르지 않습니다.',
      });
    }

    // HACK: controller에서 res객체에 접근하게 되면 return문으로 응답을 보낼 경우 무한 pending에 걸려서 express 방식으로 전달해주고 있다.
    res.status(200).json(user);
  }

  @Get('/nickname-check')
  @ApiOperation({
    summary: '닉네임 중복 체크 API',
    description:
      '사용 불가능한 닉네임일 경우 { isDuplicated: true }, 사용 가능한 닉네임일 경우 { isDuplicated: false } 를 반환한다.',
  })
  async isNicknameDuplicated(@Query() query: NicknameCheckQueryDto): Result<NicknameCheckResponseDto> {
    const { nickname } = query;
    const isDuplicated = await this.userService.isNicknameDuplicated({ nickname });

    const data = new NicknameCheckResponseDto({ isDuplicated });
    return { data };
  }

  @Get('/self')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '사용자 자신 정보 조회 API',
    description: '로그인한 사용자 자신의 정보와 프로필을 모두 반환한다.',
  })
  async retrieve(@Req() req: Request): Result<RetrieveResponseDto> {
    const { user: actor } = req.state;
    const user = await this.userService.retrieve({ id: actor.id });

    // FIXME: nested 된 프로퍼티에 whitelist 가 동작하지 않는다.
    const data = new RetrieveResponseDto(user);
    return { data };
  }
}
