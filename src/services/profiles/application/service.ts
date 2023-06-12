import { Injectable } from '@nestjs/common';
import { ProfileRepository } from '../infrastructure/repository';
import { CreateBodyDto, ListQueryDto } from '../dto';
import { Transactional } from '../../../libs/orm/transactional';
import { User } from '../../users/domain/model';
import { Profile } from '../domain/model';

@Injectable()
export class ProfileService {
  constructor(private profileRepository: ProfileRepository) {}

  async list(args: ListQueryDto) {
    const [items, count] = await Promise.all([
      this.profileRepository.find(
        {
          stacks: args.stacks?.map(Number),
          job: args.job,
          career: args.career ? Number(args.career) : undefined,
        },
        {
          limit: Number(args.limit),
          page: Number(args.page),
        },
      ),
      this.profileRepository.count(
        {
          stacks: args.stacks?.map(Number),
          job: args.job,
          career: args.career ? Number(args.career) : undefined,
        },
        {
          limit: Number(args.limit),
          page: Number(args.page),
        },
      ),
    ]);

    return {
      items,
      count,
    };
  }

  @Transactional()
  async create({ user }: { user: User }, args: CreateBodyDto) {
    const profile = new Profile({
      job: args.job,
      career: args.career,
      introduction: args.introduction,
      urls: args.urls,
      stacks: args.stacks,
      userId: user.id,
    });

    return this.profileRepository.save([profile]);
  }
}
