/* eslint-disable camelcase */
import { Body, ClassSerializerInterceptor, Controller, Injectable, Param, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import axios from 'axios';
import { getConfig } from '../../../config';
import { AuthService } from '../application/service';
import { OauthBodyDto, OauthParamDto, OauthResponseDto } from '../dto';

const oauthConfig = getConfig('/oauth');

@Controller('auth')
@ApiTags('Auth')
@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/oauth/:provider')
  @ApiOperation({ summary: 'oauth', description: 'oauth 로그인 및 회원가입 API' })
  async oauth(@Param() param: OauthParamDto, @Body() body: OauthBodyDto): Promise<OauthResponseDto> {
    if (param.provider === 'google') {
      const { access_token } = await axios
        .post(
          'https://oauth2.googleapis.com/token',
          {
            grant_type: 'authorization_code',
            client_id: oauthConfig.google.clientId,
            client_secret: oauthConfig.google.clientSecret,
            redirect_uri: oauthConfig.google.redirectUri,
            code: body.code,
          },
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        )
        .then(({ data }) => data);

      const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const { email, accessToken, refreshToken } = await this.authService.login(data.email);

      return { email, nickname: data.name, accessToken, refreshToken };
    }
    if (param.provider === 'github') {
      const { access_token } = await axios
        .post(
          'https://github.com/login/oauth/access_token',
          {
            client_id: oauthConfig.github.clientId,
            client_secret: oauthConfig.github.clientSecret,
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

      return { email, nickname: data.name, accessToken, refreshToken };
    }

    if (param.provider === 'kakao') {
      const { access_token } = await axios
        .post(
          'https://kauth.kakao.com/oauth/token',
          {
            grant_type: 'authorization_code',
            client_id: oauthConfig.kakao.clientId,
            // TODO: client_secret 은 보안을 강화하기 위해 사용한다. 제대로 된 카카오 어플리케이션 키를 만들고 나서 주입하도록 한다. (지금은 개인 계정이라 의미없음)
            redirect_uri: oauthConfig.kakao.redirectUri,
            code: body.code,
          },
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        )
        .then(({ data }) => data);

      const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const { email, accessToken, refreshToken } = await this.authService.login(data.kakao_account.email);

      return { email, nickname: data.properties.nickname, accessToken, refreshToken };
    }

    // TODO: 임시 리턴
    return { email: '??', nickname: '??', accessToken: '??', refreshToken: '??' };
  }
}
