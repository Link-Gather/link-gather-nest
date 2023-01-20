import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Transactional } from '../../../libs/orm/transactional';
import { UserRepository } from '../../users/infrastructure/repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository, private jwtService: JwtService) {}

  @Transactional()
  async login(email: string) {
    const [user] = await this.userRepository.find({ email });
    if (user) {
      // TODO: 어떤 정보로 payload 를 만들지?
      const payload = { email: user.email, nickname: user.nickname, job: user.job };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '1h',
      });

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '30d',
      });

      user.update({ refreshToken });

      await this.userRepository.save([user]);

      return { accessToken, refreshToken };
    }

    return { email };
  }
}
