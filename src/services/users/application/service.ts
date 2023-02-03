import { Injectable } from '@nestjs/common';
import { UserRepository } from '../infrastructure/repository';
import { JobType, Profile, User } from '../domain/model';
import { Transactional } from '../../../libs/orm/transactional';
import { CreateDto } from '../dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  @Transactional()
  async create(args: CreateDto) {
    const user = new User({
      ...args,
      profiles: new Profile({
        career: args.career,
        job: args.job,
        introduction: args.introduction,
        stacks: args.stacks,
        urls: args.urls,
      }),
    });
    await this.userRepository.save([user]);
    return user;
  }

  async list({ email, profiles }: { email?: string; profiles?: { jobs: JobType[] } }) {
    return this.userRepository.find({ email, profiles });
  }
}
