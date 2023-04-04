/* eslint-disable camelcase */
import { Body, ClassSerializerInterceptor, Controller, Injectable, Param, Post, UseInterceptors } from '@nestjs/common';
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
  async oauth(@Param() param: OauthParamDto, @Body() body: OauthBodyDto): Promise<OauthResponseDto> {
    if (param.provider === 'google') {
      const { access_token } = await axios
        .post(
          'https://oauth2.googleapis.com/token',
          {
            grant_type: 'authorization_code',
            client_id: OAUTH_CONFIG.google.clientId,
            client_secret: OAUTH_CONFIG.google.clientSecret,
            redirect_uri: OAUTH_CONFIG.google.redirectUri,
            code: body.code,
          },
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        )
        .then(({ data }) => data);

      const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const { email, accessToken, refreshToken } = await this.authService.login(data.email);

      return { email, nickname: data.name, provider: 'google', accessToken, refreshToken };
    }
    if (param.provider === 'github') {
      const { access_token } = await axios
        .post(
          'https://github.com/login/oauth/access_token',
          {
            client_id: OAUTH_CONFIG.github.clientId,
            client_secret: OAUTH_CONFIG.github.clientSecret,
            code: body.code,
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

      return { email, nickname: data.name, provider: 'github', accessToken, refreshToken };
    }

    const { access_token } = await axios
      .post(
        'https://kauth.kakao.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: OAUTH_CONFIG.kakao.clientId,
          client_secret: OAUTH_CONFIG.kakao.clientSecret,
          redirect_uri: OAUTH_CONFIG.kakao.redirectUri,
          code: body.code,
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      )
      .then(({ data }) => data);

    const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, accessToken, refreshToken } = await this.authService.login(data.kakao_account.email);

    return { email, nickname: data.properties.nickname, provider: 'kakao', accessToken, refreshToken };
  }

  @Post('/email-verification')
  @ApiOperation({ summary: 'email 인증 코드 발송', description: 'email 인증' })
  async verifyEmail(@Body() body: EmailVerificationBodyDto): Promise<EmailVerificationResponseDto> {
    const { email } = body;
    return this.verificationService.verifyEmail(email);
  }

  @Post('/email-verification/:id/confirm')
  @ApiOperation({ summary: 'email 인증 코드 확인', description: '인증이 실패하면 error를 던진다.' })
  async verifyEmailConfirm(
    @Param() param: EmailVerificationConfirmParamDto,
    @Body() body: EmailVerificationConfirmBodyDto,
  ) {
    const { code } = body;
    const { id } = param;
    await this.verificationService.confirm({ code, id: Number(id) });
  }
}
