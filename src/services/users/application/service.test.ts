import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../infrastructure/repository';
import { UserService } from './service';
import { dataSource } from '../../../libs/orm';
import { plainToClass } from '../../../test';
import { Profile, User } from '../domain/model';

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
    const userRepositorySaveSpy = jest.spyOn(userRepository, 'save').mockResolvedValue();

    const result = await userService.create({
      email: 'email@test.com',
      password: 'qhupr22qp3ir23qrn2-23rnj1p',
      nickname: 'arthur',
      provider: 'link-gather',
      career: 1,
      job: 'Developer',
      introduction: 'link-gather creator',
      stacks: ['node.js', 'typescript', 'react.js'],
      urls: ['https://github.com/changchanghwang'],
    });

    expect(userRepositorySaveSpy.mock.calls).toHaveLength(1);
    expect(userRepositorySaveSpy.mock.calls[0][0]).toEqual([result]);

    expect(userService).toBeDefined();
  });

  describe('nickname duplicated check 테스트', () => {
    test('이미 사용중인 닉네임이면 true 를 반환한다.', async () => {
      const user = plainToClass(User, {
        career: 1,
        email: 'email@test.com',
        id: 'nanoid',
        introduction: 'link-gather creator',
        job: 'Developer',
        nickname: 'windy',
        password: expect.not.stringMatching('qhupr22qp3ir23qrn2-23rnj1p'),
        profileImage: 'image url',
        provider: 'link-gather',
        profiles: [
          plainToClass(Profile, {
            career: 1,
            id: 'nanoid',
            introduction: 'link-gather creator',
            job: 'Developer',
            stacks: ['node.js', 'typescript', 'react.js'],
            urls: ['https://github.com/changchanghwang'],
          }),
        ],
        stacks: ['node.js', 'typescript', 'react.js'],
        urls: ['https://github.com/changchanghwang'],
      });
      const userRepositoryFindSpy = jest.spyOn(userRepository, 'find').mockResolvedValue([user]);

      const result = await userService.isNicknameDuplicated({ nickname: 'windy' });

      expect(userRepositoryFindSpy).toHaveBeenCalledWith({ nickname: 'windy' });
      expect(result).toBe(true);
    });

    test('사용 가능한 닉네임이면 false 를 반환한다.', async () => {
      const userRepositoryFindSpy = jest.spyOn(userRepository, 'find').mockResolvedValue([]);

      const result = await userService.isNicknameDuplicated({ nickname: 'windy' });

      expect(userRepositoryFindSpy).toHaveBeenCalledWith({ nickname: 'windy' });
      expect(result).toBe(false);
    });
  });
});
