import { Module } from '@nestjs/common';
import { ProjectRepository } from '../projects/infrastructure/repository';
import { BookmarkRepository } from './infrastructure/repository';
import { BookmarkController } from './presentation/controller';
import { BookmarkService } from './application/service';

@Module({
  imports: [],
  controllers: [BookmarkController],
  providers: [BookmarkService, BookmarkRepository, ProjectRepository],
})
export class BookmarkModule {}
