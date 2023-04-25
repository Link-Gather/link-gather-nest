import { Test, TestingModule } from '@nestjs/testing';
import { StackService } from './service';
import { dataSource } from '../../../libs/orm';
import { plainToClass } from '../../../libs/test';
import { StackRepository } from '../infrastructure/repository';
import { Stack } from '../domain/model';

jest.mock('../infrastructure/repository');

describe('StackService 테스트', () => {
  let stackService: StackService;
  let stackRepository: StackRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        StackService,
        StackRepository,
        { provide: 'entityManager', useValue: dataSource.createEntityManager() },
      ],
    }).compile();
    stackService = module.get<StackService>(StackService);
    stackRepository = module.get<StackRepository>(StackRepository);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  const stacks = [
    plainToClass(Stack, {
      id: 1,
      name: 'node.js',
      length: 2,
    }),
    plainToClass(Stack, {
      id: 2,
      name: 'typescript',
      length: 3,
    }),
    plainToClass(Stack, {
      id: 3,
      name: 'react',
      length: 1,
    }),
  ];

  describe('list test', () => {
    test('기술스택 목록을 리턴한다.', async () => {
      const stackRepositoryFindSpy = jest.spyOn(stackRepository, 'find').mockResolvedValue(stacks);

      const result = await stackService.list();

      expect(stackRepositoryFindSpy.mock.calls).toHaveLength(1);
      expect(result).toBe(stacks);
    });
  });
});
