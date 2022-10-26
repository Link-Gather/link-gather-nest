import { Module } from '@nestjs/common';
import { PostRepository } from './infrastructure/repository';
import { PostController } from './presentation/controller';
import { PostService } from './application/service';
import { CustomTypeOrmModule } from '../../libs/orm';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([PostRepository])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
