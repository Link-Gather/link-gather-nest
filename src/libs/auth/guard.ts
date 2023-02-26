import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getConfig } from '../../config';
import { AuthService } from '../../services/auth/application/service';
import { UserRepository } from '../../services/users/infrastructure/repository';
import { unauthorized } from '../exception';

const JWT_SECRET = getConfig('/jwtSecret');

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    // NOTE: 헤더에서는 전부 소문자로 온다.
    const { accesstoken: accessToken, refreshtoken: refreshToken } = req.headers;

    if (accessToken) {
      const [type, token] = accessToken.split(' ');
      if (type !== 'Bearer') {
        throw unauthorized('Token type is not `Bearer`', { errorMessage: '토큰 타입이 잘못 되었습니다.' });
      }
      try {
        const { id } = await this.jwtService.verifyAsync(token, { secret: JWT_SECRET });
        const user = await this.userRepository.findOneOrFail(id);
        req.state = { user };
        return true;
      } catch (err) {
        if (err.message === 'jwt expired') {
          throw unauthorized('Access token is expired.');
        }
        throw err;
      }
    }
    if (refreshToken) {
      const [type, token] = refreshToken.split(' ');
      if (type !== 'Bearer') {
        throw unauthorized('Token type is not `Bearer`', { errorMessage: '토큰 타입이 잘못 되었습니다.' });
      }
      const data = await this.authService.revise(token);
      req.state = { user: data.user };

      res.cookie('accessToken', data.accessToken);
      res.cookie('refreshToken', data.refreshToken);
      return true;
    }
    return false;
  }
}
