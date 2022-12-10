import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../infrastructure/repository';
import { UserService } from './service';
import { dataSource } from '../../../libs/orm';

jest.mock('../../../libs/orm', () => ({
  dataSource: {
    manager: {
      transaction: jest.fn(),
    },
    createEntityManager: jest.fn(() => ({
      getManager: jest.fn(),
    })),
  },
}));

describe('UserService 테스트', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        { provide: 'entityManager', useValue: dataSource.createEntityManager() },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  test('create 테스트', async () => {
    // // @ts-expect-error
    const userRepositorySaveSpy = jest.spyOn(userRepository, 'save').mockResolvedValue();

    const result = await userService.create({
      email: 'email@test.com',
      password: 'qhupr22qp3ir23qrn2-23rnj1p',
      nickname: 'arthur',
      provider: 'Link-Gather',
      career: 1,
      job: 'Developer',
      introduction: 'link-gather creator',
      stacks: ['node.js', 'typescript', 'react.js'],
      urls: ['https://github.com/changchanghwang'],
    });

    console.log(userRepository);
    expect(userRepositorySaveSpy.mock.calls).toHaveLength(1);
    expect(userRepositorySaveSpy.mock.calls).toEqual({});

    expect(userService).toBeDefined();
  });
});
