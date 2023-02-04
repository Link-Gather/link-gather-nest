/* eslint-disable camelcase */
import { Body, ClassSerializerInterceptor, Controller, Injectable, Param, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import axios from 'axios';
import { getConfig } from '../../../config';
import { AuthService } from '../application/service';
import { OauthBodyDto, OauthParamDto, OauthResponseDto } from '../dto';

const { clientId, clientSecret, redirectUri } = getConfig('/oauth/google');

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
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
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

    // TODO: 임시 리턴
    return { email: '??', nickname: '??', accessToken: '??', refreshToken: '??' };
  }
}
