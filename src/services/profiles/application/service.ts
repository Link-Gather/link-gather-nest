import { Injectable } from '@nestjs/common';
import { ProfileRepository } from '../infrastructure/repository';
import { ListQueryDto } from '../dto';

@Injectable()
export class ProfileService {
  constructor(private profileRepository: ProfileRepository) {}

  async list(args: ListQueryDto) {
    const [items, count] = await Promise.all([
      this.profileRepository.find(
        { stacks: args.stacks?.map(Number), job: args.job },
        {
          limit: Number(args.limit),
          page: Number(args.page),
        },
      ),
      this.profileRepository.count(
        { stacks: args.stacks?.map(Number), job: args.job },
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
}
