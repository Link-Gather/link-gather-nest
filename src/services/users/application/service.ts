import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { UserRepository } from '../infrastructure/repository';
import { JobType, User } from '../domain/model';
import { Transactional } from '../../../libs/orm/transactional';
import { SignInBodyDto, SignUpBodyDto } from '../dto';
import { badRequest, unauthorized } from '../../../libs/exception';
import { getConfig } from '../../../config';

const SALT_ROUNDS = getConfig('/saltRounds');

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository, private jwtService: JwtService) {}

  @Transactional()
  async signUp(args: SignUpBodyDto) {
    const [newUser] = await this.userRepository.find({ email: args.email });

    if (newUser) {
      throw unauthorized('이미 존재하는 이메일입니다.');
    }

    const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
    const password = await bcrypt.hash(args.password || nanoid(10), salt);

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
    if (!user) {
      throw badRequest(`이메일(${args.email})이 일치하지 않습니다.`, {
        errorMessage: '이메일이나 패스워드가 일치하지 않습니다.',
      });
    }
    await user.validatePassword(args.password);

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

  async isNicknameDuplicated({ nickname }: { nickname: string }) {
    const [user] = await this.userRepository.find({ nickname });

    return !!user;
  }
}
