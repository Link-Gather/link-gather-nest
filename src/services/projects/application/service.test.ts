import { Test, TestingModule } from '@nestjs/testing';
import { nanoid } from 'nanoid';
import { ProjectRepository } from '../infrastructure/repository';
import { ProjectService } from './service';
import { dataSource } from '../../../libs/orm';
import { RoleRepository } from '../../roles/infrastructure/repository';
import { plainToClass } from '../../../libs/test';
import { Profile, User } from '../../users/domain/model';

jest.mock('nanoid');
jest.mock('../infrastructure/repository');
jest.mock('../../roles/infrastructure/repository');

describe('ProjectService 테스트', () => {
  let projectService: ProjectService;
  let projectRepository: ProjectRepository;
  let roleRepository: RoleRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        ProjectRepository,
        RoleRepository,
        { provide: 'entityManager', useValue: dataSource.createEntityManager() },
      ],
    }).compile();
    projectService = module.get<ProjectService>(ProjectService);
    projectRepository = module.get<ProjectRepository>(ProjectRepository);
    roleRepository = module.get<RoleRepository>(RoleRepository);
  });

  beforeEach(() => {
    const mockedNanoid = nanoid as jest.Mock<string>;
    mockedNanoid.mockImplementation(() => 'IRFa-VaY2b');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const user = plainToClass(User, {
    id: 'userId',
    email: 'test@test.com',
    password: 'password',
    nickname: 'arthur',
    profileImage: '',
    provider: 'link-gather',
    profiles: [
      plainToClass(Profile, {
        id: 'profileId',
        introduction: 'hello, my name is arthur',
        career: 1,
        job: 'backendDeveloper',
        stacks: [1, 6, 22],
        urls: ['https://github.com/changchanghwang'],
      }),
    ],
  });

  describe('create test', () => {
    test('프로젝트를 생성하고 리더 역할을 생성한다.', async () => {
      const projectRepositorySaveSpy = jest.spyOn(projectRepository, 'save');
      const roleRepositorySaveSpy = jest.spyOn(roleRepository, 'save');

      const project = await projectService.create(
        { user },
        {
          title: 'title',
          description: 'description',
          recruitMember: { frontendDeveloper: 2, backendDeveloper: 2, designer: 1, productManager: 1 },
          stacks: [1, 6],
          period: 1,
          purpose: 'business',
          leaderJob: 'backendDeveloper',
        },
      );

      expect(projectRepositorySaveSpy.mock.calls).toHaveLength(1);
      expect(roleRepositorySaveSpy.mock.calls).toHaveLength(1);
      expect(projectRepositorySaveSpy.mock.calls[0][0]).toEqual([
        {
          id: 'IRFa-VaY2b',
          description: 'description',
          isRecruiting: true,
          period: 1,
          purpose: 'business',
          recruitMember: {
            backendDeveloper: 2,
            designer: 1,
            frontendDeveloper: 2,
            productManager: 1,
          },
          stacks: [1, 6],
          bookMarkCount: 0,
          status: 'recruiting',
          title: 'title',
        },
      ]);
      expect(roleRepositorySaveSpy.mock.calls[0][0]).toEqual([
        {
          job: 'backendDeveloper',
          projectId: project.id,
          type: 'leader',
          userId: 'userId',
        },
      ]);
    });
  });
});
