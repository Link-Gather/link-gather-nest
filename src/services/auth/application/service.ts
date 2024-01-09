import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getConfig } from '@config';
import { badRequest } from '@libs/exception';
import { Transactional } from '@libs/orm/transactional';
import { UserRepository } from '../../users/infrastructure/repository';

const JWT_SECRET = getConfig('/jwtSecret');

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository, private jwtService: JwtService) {}

  @Transactional()
  async login(email: string) {
    const [user] = await this.userRepository.find({ email });
    if (user) {
      const payload = { id: user.id };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '1h',
      });

      const refreshToken = this.jwtService.sign(
        {},
        {
          expiresIn: '30d',
        },
      );

      user.update({ refreshToken });

      await this.userRepository.save([user]);

      return { accessToken, refreshToken };
    }

    return { email };
  }

  @Transactional()
  async revise(token: string) {
    const [user] = await this.userRepository.find({ refreshToken: token });
    if (user) {
      const { exp } = await this.jwtService.verifyAsync(token, { secret: JWT_SECRET });
      const accessToken = this.jwtService.sign(
        { id: user.id },
        {
          expiresIn: '1h',
          secret: JWT_SECRET,
        },
      );
      const refreshToken = this.jwtService.sign(
        {},
        {
          expiresIn: exp,
          secret: JWT_SECRET,
        },
      );
      user.update({ refreshToken });
      await this.userRepository.save([user]);

      return { accessToken, refreshToken, user };
    }
    throw badRequest('유저를 찾을 수 없습니다.');
  }
}
