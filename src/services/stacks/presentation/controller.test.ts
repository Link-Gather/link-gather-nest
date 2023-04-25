import { Test, TestingModule } from '@nestjs/testing';
import { StackService } from '../application/service';
import { StackController } from './controller';
import { StackRepository } from '../infrastructure/repository';
import { dataSource } from '../../../libs/orm';
import { plainToClass } from '../../../libs/test';
import { Stack } from '../domain/model';

jest.mock('../application/service');

describe('StackController test', () => {
  let stackController: StackController;
  let stackService: StackService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StackController],
      providers: [
        StackService,
        StackRepository,
        { provide: 'entityManager', useValue: dataSource.createEntityManager() },
      ],
    }).compile();
    stackService = module.get<StackService>(StackService);
    stackController = module.get<StackController>(StackController);
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

  describe('GET / test', () => {
    test('stackService.list 호출한다.', async () => {
      const stackServiceListSpyOn = jest.spyOn(stackService, 'list').mockResolvedValue(stacks);

      const result = await stackController.list();

      expect(stackServiceListSpyOn.mock.calls).toHaveLength(1);
      expect(result).toEqual({ data: stacks });
    });
  });
});
