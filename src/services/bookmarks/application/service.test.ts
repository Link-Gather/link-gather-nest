import { Test, TestingModule } from '@nestjs/testing';
import { nanoid } from 'nanoid';
import { Project } from '../../projects/domain/model';
import { BookmarkRepository } from '../infrastructure/repository';
import { BookmarkService } from './service';
import { dataSource } from '../../../libs/orm';
import { mockDate, plainToClass, resetDate } from '../../../libs/test';
import { User } from '../../users/domain/model';
import { Bookmark } from '../domain/model';
import { ProjectRepository } from '../../projects/infrastructure/repository';

jest.mock('nanoid');
jest.mock('../infrastructure/repository');
jest.mock('../../projects/infrastructure/repository');

describe('ProjectService 테스트', () => {
  let bookmarkService: BookmarkService;
  let bookmarkRepository: BookmarkRepository;
  let projectRepository: ProjectRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarkService,
        BookmarkRepository,
        ProjectRepository,
        { provide: 'entityManager', useValue: dataSource.createEntityManager() },
      ],
    }).compile();
    bookmarkService = module.get<BookmarkService>(BookmarkService);
    bookmarkRepository = module.get<BookmarkRepository>(BookmarkRepository);
    projectRepository = module.get<ProjectRepository>(ProjectRepository);
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
    test('북마크가 존재하지 않을 경우 새로 북마크를 만들고 해당 프로젝트의 bookmarkCount + 1 한다.', async () => {
      const project = plainToClass(Project, {
        id: 'testprojectid',
        title: 'test project',
        description: '테스트용',
        purpose: 'fun',
        recruitMember: { backendDeveloper: 1, frontendDeveloper: 2, designer: 3, productManager: 1 },
        period: 3,
        stacks: [1, 3],
        status: 'recruiting',
        bookMarkCount: 0,
        isRecruiting: true,
      });

      const bookmarkRepositorySaveSpy = jest.spyOn(bookmarkRepository, 'save');
      const projectRepositorySaveSpy = jest.spyOn(projectRepository, 'save');
      jest.spyOn(bookmarkRepository, 'find').mockResolvedValue([]);
      jest.spyOn(projectRepository, 'findOneOrFail').mockResolvedValue(project);

      await bookmarkService.handle({ user }, 'testId12');

      expect(bookmarkRepositorySaveSpy.mock.calls).toHaveLength(1);
      expect(bookmarkRepositorySaveSpy.mock.calls[0][0]).toEqual([
        {
          userId: 'userId',
          projectId: 'testId12',
        },
      ]);
      expect(projectRepositorySaveSpy.mock.calls[0][0]).toEqual([
        {
          id: 'testprojectid',
          title: 'test project',
          description: '테스트용',
          purpose: 'fun',
          recruitMember: { backendDeveloper: 1, frontendDeveloper: 2, designer: 3, productManager: 1 },
          period: 3,
          stacks: [1, 3],
          status: 'recruiting',
          bookMarkCount: 1,
          isRecruiting: true,
        },
      ]);
    });

    test('북마크가 존재할 경우 북마크를 삭제하고 해당 프로젝트의 bookmarkCount - 1 한다.', async () => {
      const project = plainToClass(Project, {
        id: 'testprojectid',
        title: 'test project',
        description: '테스트용',
        purpose: 'fun',
        recruitMember: { backendDeveloper: 1, frontendDeveloper: 2, designer: 3, productManager: 1 },
        period: 3,
        stacks: [1, 3],
        status: 'recruiting',
        bookMarkCount: 4,
        isRecruiting: true,
      });

      const bookmark = plainToClass(Bookmark, {
        id: 1,
        userId: 'userId',
        projectId: 'testid123',
      });

      jest.spyOn(bookmarkRepository, 'find').mockResolvedValue([bookmark]);

      const bookmarkRepositoryDeleteSpy = jest.spyOn(bookmarkRepository, 'delete');

      const projectRepositorySaveSpy = jest.spyOn(projectRepository, 'save');
      jest.spyOn(projectRepository, 'findOneOrFail').mockResolvedValue(project);

      await bookmarkService.handle({ user }, 'testId12');

      expect(bookmarkRepositoryDeleteSpy.mock.calls).toHaveLength(1);
      expect(projectRepositorySaveSpy.mock.calls[0][0]).toEqual([
        {
          id: 'testprojectid',
          title: 'test project',
          description: '테스트용',
          purpose: 'fun',
          recruitMember: { backendDeveloper: 1, frontendDeveloper: 2, designer: 3, productManager: 1 },
          period: 3,
          stacks: [1, 3],
          status: 'recruiting',
          bookMarkCount: 3,
          isRecruiting: true,
        },
      ]);
    });
  });
});
