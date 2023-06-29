import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../projects/infrastructure/repository';
import { BookmarkRepository } from '../infrastructure/repository';
import { Bookmark } from '../domain/model';
import { Transactional } from '../../../libs/orm/transactional';
import { User } from '../../users/domain/model';

@Injectable()
export class BookmarkService {
  constructor(private bookmarkRepository: BookmarkRepository, private projectRepository: ProjectRepository) {}

  async list({ user }: { user: User }) {
    return this.bookmarkRepository.find({ userId: user.id });
  }

  @Transactional()
  async handle({ user }: { user: User }, projectId: string) {
    const [[bookmark], project] = await Promise.all([
      this.bookmarkRepository.find({ userId: user.id, projectId }),
      this.projectRepository.findOneOrFail(projectId),
    ]);

    if (bookmark) {
      this.bookmarkRepository.delete([bookmark.id]);
    } else {
      const newBookmark = new Bookmark({
        userId: user.id,
        projectId,
      });

      await this.bookmarkRepository.save([newBookmark]);
    }

    project.bookmarkCountChange(!!bookmark);
    await this.projectRepository.save([project]);
  }
}
