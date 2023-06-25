import { Injectable } from '@nestjs/common';
import { BookmarkRepository } from '../infrastructure/repository';
import { Bookmark } from '../domain/model';
import { Transactional } from '../../../libs/orm/transactional';
import { User } from '../../users/domain/model';

@Injectable()
export class BookmarkService {
  constructor(private bookmarkRepository: BookmarkRepository) {}

  async list({ user }: { user: User }) {
    return this.bookmarkRepository.find({ userId: user.id });
  }

  @Transactional()
  async click({ user }: { user: User }, projectId: string) {
    const [bookmark] = await this.bookmarkRepository.find({ userId: user.id, projectId });

    if (bookmark) {
      bookmark.delete();

      await this.bookmarkRepository.save([bookmark]);
    } else {
      const newBookmark = new Bookmark({
        userId: user.id,
        projectId,
      });

      await this.bookmarkRepository.save([newBookmark]);
    }
  }
}
