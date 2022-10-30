import { Module } from '@nestjs/common';
import { PostRepository } from './infrastructure/repository';
import { PostController } from './presentation/controller';
import { PostService } from './application/service';

@Module({
  imports: [],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
