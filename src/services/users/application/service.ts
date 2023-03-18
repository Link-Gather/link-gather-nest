import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../infrastructure/repository';
import { JobType, User } from '../domain/model';
import { Transactional } from '../../../libs/orm/transactional';
import type { SignUpBodyDto } from '../dto';
import { unauthorized } from '../../../libs/exception';
import { getConfig } from '../../../config';

const SALT_ROUNDS = getConfig('/saltRounds');

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  @Transactional()
  async signUp(args: SignUpBodyDto) {
    const [newUser] = await this.userRepository.find({ email: args.email });

    if (newUser) {
      throw unauthorized('이미 존재하는 이메일입니다.');
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const password = await bcrypt.hash(args.password, salt);

    const user = new User({
      ...args,
      password,
    });
    await this.userRepository.save([user]);
  }

  async list({ email, profiles }: { email?: string; profiles?: { jobs: JobType[] } }) {
    return this.userRepository.find({ email, profiles });
  }

  async isNicknameDuplicated({ nickname }: { nickname: string }) {
    const [user] = await this.userRepository.find({ nickname });

    return !!user;
  }
}
