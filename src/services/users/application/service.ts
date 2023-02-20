import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../infrastructure/repository';
import { JobType, User } from '../domain/model';
import { Transactional } from '../../../libs/orm/transactional';
import type { SignUpBodyDto } from '../dto';
import { unauthorized } from '../../../libs/exception';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

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
}
