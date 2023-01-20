/* eslint-disable camelcase */
import { Body, ClassSerializerInterceptor, Controller, Injectable, Param, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import axios from 'axios';
import { AuthService } from '../application/service';

@Controller('auth')
@ApiTags('Auth')
@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/oauth/:provider')
  @ApiOperation({ summary: 'Oauth', description: 'Oauth authorization code handling' })
  async oauth(@Param('provider') provider: 'google' | 'kakao' | 'github', @Body('code') code: string) {
    if (provider === 'google') {
      const { access_token } = await axios
        .post(
          'https://oauth2.googleapis.com/token',
          {
            grant_type: 'authorization_code',
            client_id: '309882686963-6b4njgfm8o6f6gets6c7a3djcbvi59qg.apps.googleusercontent.com',
            client_secret: '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',
            redirect_uri: 'http://localhost:3001/google1',
            code,
          },
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        )
        .then(({ data }) => data);

      const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      return this.authService.login(data.email);
    }

    // TODO: 여기선 무엇을 리턴해야하지?
    return '??';
  }
}
