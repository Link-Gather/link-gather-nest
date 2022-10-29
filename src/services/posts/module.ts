import { Module } from '@nestjs/common';
import { PostRepository } from './infrastructure/repository';
import { PostController } from './presentation/controller';
import { PostService } from './application/service';
import { TypeOrmModule } from '../../libs/orm';

@Module({
  imports: [TypeOrmModule.forRepository([PostRepository])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
