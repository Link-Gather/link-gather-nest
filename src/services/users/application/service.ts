import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../infrastructure/repository';
import { JobType, User } from '../domain/model';
import { Transactional } from '../../../libs/orm/transactional';
import type { SignInBodyDto, SignUpBodyDto } from '../dto';
import { badRequest, unauthorized } from '../../../libs/exception';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository, private jwtService: JwtService) {}

  @Transactional()
  async signUp(args: SignUpBodyDto) {
    const [newUser] = await this.userRepository.find({ email: args.email });

    if (newUser) {
      throw unauthorized('이미 존재하는 이메일입니다.');
    }

    // TODO: salt 를 환경변수로 주입?
    const password = await bcrypt.hash(args.password, 10);

    const user = new User({
      ...args,
      password,
    });
    await this.userRepository.save([user]);
  }

  async list({ email, profiles }: { email?: string; profiles?: { jobs: JobType[] } }) {
    return this.userRepository.find({ email, profiles });
  }

  @Transactional()
  async signIn(args: SignInBodyDto) {
    const [user] = await this.userRepository.find({ email: args.email });
    if (!user || !(await bcrypt.compare(args.password, user.password))) {
      throw badRequest(`이메일(${user.email})이나 패스워드(${user.password})가 일치하지 않습니다.`, {
        errorMessage: '이메일이나 패스워드가 일치하지 않습니다.',
      });
    }

    const accessToken = this.jwtService.sign(
      { id: user.id },
      {
        expiresIn: '1h',
      },
    );

    const refreshToken = this.jwtService.sign(
      {},
      {
        expiresIn: '30d',
      },
    );

    user.update({ refreshToken });
    await this.userRepository.save([user]);

    return { accessToken, refreshToken, user };
  }
}
