import { Test, TestingModule } from '@nestjs/testing';
import { nanoid } from 'nanoid';
import { BookmarkRepository } from '../infrastructure/repository';
import { BookmarkService } from './service';
import { dataSource } from '../../../libs/orm';
import { RoleRepository } from '../../roles/infrastructure/repository';
import { mockDate, plainToClass, resetDate } from '../../../libs/test';
import { User } from '../../users/domain/model';
import { Bookmark } from '../domain/model';

jest.mock('nanoid');
jest.mock('../infrastructure/repository');

describe('ProjectService 테스트', () => {
  let bookmarkService: BookmarkService;
  let bookmarkRepository: BookmarkRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarkService,
        BookmarkRepository,
        RoleRepository,
        { provide: 'entityManager', useValue: dataSource.createEntityManager() },
      ],
    }).compile();
    bookmarkService = module.get<BookmarkService>(BookmarkService);
    bookmarkRepository = module.get<BookmarkRepository>(BookmarkRepository);
  });

  beforeEach(() => {
    const mockedNanoid = nanoid as jest.Mock<string>;
    mockedNanoid.mockImplementation(() => 'IRFa-VaY2b');
    mockDate('2023-06-25T00:00:00.000Z');
  });

  afterEach(() => {
    jest.clearAllMocks();
    resetDate();
  });

  const user = plainToClass(User, {
    id: 'userId',
    email: 'test@test.com',
    password: 'password',
    nickname: 'arthur',
    profileImage: '',
    provider: 'link-gather',
  });

  describe('click test', () => {
    test('북마크가 존재하지 않을 경우 새로 북마크를 만든다.', async () => {
      const bookmarkRepositorySaveSpy = jest.spyOn(bookmarkRepository, 'save');
      jest.spyOn(bookmarkRepository, 'find').mockResolvedValue([]);

      await bookmarkService.click({ user }, 'testId12');

      expect(bookmarkRepositorySaveSpy.mock.calls).toHaveLength(1);
      expect(bookmarkRepositorySaveSpy.mock.calls[0][0]).toEqual([
        {
          userId: 'userId',
          projectId: 'testId12',
        },
      ]);
    });

    test('북마크가 존재할 경우 북마크를 삭제한다.', async () => {
      const bookmark = plainToClass(Bookmark, {
        id: 1,
        userId: 'userId',
        projectId: 'testid123',
      });

      jest.spyOn(bookmarkRepository, 'find').mockResolvedValue([bookmark]);

      const bookmarkRepositorySaveSpy = jest.spyOn(bookmarkRepository, 'save');
      const bookmarkRepositoryFindSpy = jest.spyOn(bookmarkRepository, 'find');

      await bookmarkService.click({ user }, 'testId12');

      expect(bookmarkRepositoryFindSpy.mock.calls).toHaveLength(1);
      expect(bookmarkRepositorySaveSpy.mock.calls[0][0]).toEqual([
        {
          id: 1,
          userId: 'userId',
          projectId: 'testid123',
          deletedAt: new Date('2023-06-25'),
        },
      ]);
    });
  });
});
