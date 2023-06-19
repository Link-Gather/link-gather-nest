import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getConfig } from '../../config';
import { AuthService } from '../../services/auth/application/service';
import { UserRepository } from '../../services/users/infrastructure/repository';
import { unauthorized } from '../exception';

const JWT_SECRET = getConfig('/jwtSecret');

@Injectable()
// NOTE: AuthGuard 와 다르게 token 이 없으면 undefined 를 리턴해준다.
export class UserGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const { accessToken, refreshToken } = req.signedCookies;

    if (accessToken) {
      try {
        const [type, token] = accessToken.split(' ');
        if (type !== 'Bearer') {
          throw unauthorized(`Token type(${type}) is not 'Bearer'`, { errorMessage: '토큰 타입이 잘못 되었습니다.' });
        }
        const { id } = await this.jwtService.verifyAsync(token, { secret: JWT_SECRET });
        const user = await this.userRepository.findOneOrFail(id);
        req.state = { user };
        return true;
      } catch (err) {
        if (err.message === 'jwt expired' && refreshToken) {
          const [type, token] = refreshToken.split(' ');
          if (type !== 'Bearer') {
            throw unauthorized(`Token type(${type}) is not 'Bearer'`, { errorMessage: '토큰 타입이 잘못 되었습니다.' });
          }
          const data = await this.authService.revise(token);
          req.state = { user: data.user };

          res.cookie('accessToken', `Bearer ${data.accessToken}`, { signed: true, httpOnly: true });
          res.cookie('refreshToken', `Bearer ${data.refreshToken}`, { signed: true, httpOnly: true });
          return true;
        }
        throw err;
      }
    }

    req.state = { user: undefined };
    return true;
  }
}
