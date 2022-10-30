import { Module } from '@nestjs/common';
import { PostRepository } from './infrastructure/repository';
import { PostController } from './presentation/controller';
import { PostService } from './application/service';
import { UserService } from '../users/application/service';
import { UserRepository } from '../users/infrastructure/repository';

@Module({
  imports: [],
  controllers: [PostController],
  providers: [PostService, PostRepository, UserService, UserRepository],
})
export class PostModule {}
