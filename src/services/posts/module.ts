import { Module } from '@nestjs/common';
import { PostRepository } from './infrastructure/repository';
import { PostController } from './presentation/controller';
import { PostService } from './application/service';
import { DatabaseModule } from '../../libs/orm/database.module';

@Module({
  imports: [DatabaseModule.manager()],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
