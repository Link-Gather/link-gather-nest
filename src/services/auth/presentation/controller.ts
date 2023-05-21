/* eslint-disable camelcase */
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import axios from 'axios';
import { getConfig } from '../../../config';
import { VerificationService } from '../../verifications/application/service';
import { AuthService } from '../application/service';
import {
  OauthBodyDto,
  OauthParamDto,
  OauthResponseDto,
  EmailVerificationBodyDto,
  EmailVerificationConfirmBodyDto,
  EmailVerificationConfirmParamDto,
  EmailVerificationResponseDto,
} from '../dto';

const OAUTH_CONFIG = getConfig('/oauth');

@Controller('auth')
@ApiTags('Auth')
@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly verificationService: VerificationService) {}

  @Post('/oauth/:provider')
  @ApiOperation({ summary: 'oauth', description: 'oauth 로그인' })
  async oauth(@Param() param: OauthParamDto, @Body() body: OauthBodyDto): Result<OauthResponseDto> {
    const { provider } = param;
    const { code } = body;
    if (provider === 'google') {
      const { access_token } = await axios
        .post(
          'https://oauth2.googleapis.com/token',
          {
            grant_type: 'authorization_code',
            client_id: OAUTH_CONFIG.google.clientId,
            client_secret: OAUTH_CONFIG.google.clientSecret,
            redirect_uri: OAUTH_CONFIG.google.redirectUri,
            code,
          },
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        )
        .then(({ data }) => data);

      const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const { email, accessToken, refreshToken } = await this.authService.login(data.email);

      const result = new OauthResponseDto({
        email,
        nickname: data.name,
        provider: 'google',
        accessToken,
        refreshToken,
      });

      return { data: { data: result } };
    }
    if (provider === 'github') {
      const { access_token } = await axios
        .post(
          'https://github.com/login/oauth/access_token',
          {
            client_id: OAUTH_CONFIG.github.clientId,
            client_secret: OAUTH_CONFIG.github.clientSecret,
            code,
          },
          {
            headers: {
              accept: 'application/json',
            },
          },
        )
        .then(({ data }) => data);

      const { data } = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Token ${access_token}` },
      });
      const { email, accessToken, refreshToken } = await this.authService.login(data.email);

      const result = new OauthResponseDto({
        email,
        nickname: data.name,
        provider: 'github',
        accessToken,
        refreshToken,
      });

      return { data: { data: result } };
    }

    const { access_token } = await axios
      .post(
        'https://kauth.kakao.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: OAUTH_CONFIG.kakao.clientId,
          client_secret: OAUTH_CONFIG.kakao.clientSecret,
          redirect_uri: OAUTH_CONFIG.kakao.redirectUri,
          code,
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      )
      .then(({ data }) => data);

    const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, accessToken, refreshToken } = await this.authService.login(data.kakao_account.email);

    const result = new OauthResponseDto({
      email,
      nickname: data.properties.nickname,
      provider: 'kakao',
      accessToken,
      refreshToken,
    });

    return { data: { data: result } };
  }

  @Post('/email-verification')
  @ApiOperation({ summary: 'email 인증 코드 발송', description: 'email 인증' })
  async verifyEmail(@Body() body: EmailVerificationBodyDto): Result<EmailVerificationResponseDto> {
    const { email, type } = body;
    const { id } = await this.verificationService.start({ email, type });

    const result = new EmailVerificationResponseDto({
      id,
    });

    return { data: { data: result } };
  }

  @Post('/email-verification/:id')
  @ApiOperation({ summary: 'email 인증 코드 확인 (코드입력)', description: '인증이 실패하면 error를 던진다.' })
  async verifyEmailConfirm(
    @Param() param: EmailVerificationConfirmParamDto,
    @Body() body: EmailVerificationConfirmBodyDto,
  ): Promise<void> {
    const { code } = body;
    const { id } = param;
    await this.verificationService.confirm({ code, id: Number(id) });
  }

  @Get('/email-verification/:id')
  @ApiOperation({ summary: 'email 인증 코드 확인 (화면 접근)', description: '인증이 실패하면 error를 던진다.' })
  async isValidVerification(@Param() param: EmailVerificationConfirmParamDto): Promise<void> {
    const { id } = param;
    this.verificationService.isValidVerification(Number(id));
  }
}
