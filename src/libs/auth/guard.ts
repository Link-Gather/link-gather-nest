import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getConfig } from '../../config';
import { UserRepository } from '../../services/users/infrastructure/repository';
import { unauthorized } from '../exception';

const jwtSecret = getConfig('/jwtSecret');

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // NOTE: 헤더에서는 전부 소문자로 온다.
    const { accesstoken: accessToken, refreshtoken: refreshToken } = request.headers;

    if (accessToken) {
      const [type, token] = accessToken.split(' ');
      if (type !== 'Bearer') {
        throw unauthorized('Token type is not `Bearer`', { errorMessage: '토큰 타입이 잘못 되었습니다.' });
      }
      try {
        const { id } = await this.jwtService.verifyAsync(token, { secret: jwtSecret });
        const user = await this.userRepository.findOneOrFail(id);
        request.state = { user };
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
      const { id } = await this.jwtService.verifyAsync(token, { secret: jwtSecret });
      const user = await this.userRepository.findOneOrFail(id);
      request.state = { user };
      return true;
    }
    return false;
  }
}
