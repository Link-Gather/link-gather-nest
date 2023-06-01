import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../users/infrastructure/repository';
import { AuthService } from './service';
import { dataSource } from '../../../libs/orm';
import { Profile, User } from '../../users/domain/model';
import { plainToClass } from '../../../libs/test';
import { badRequest } from '../../../libs/exception';

const mockJwtService = {
  sign: jest.fn(() => 'TOKEN'),
  verify: jest.fn(() => 'verify'),
  verifyAsync: jest.fn(() => {
    return { exp: 1613641614 };
  }),
};

describe('AuthService 테스트', () => {
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'TEST-TOKEN',
        }),
      ],
      providers: [
        AuthService,
        UserRepository,
        { provide: JwtService, useValue: mockJwtService },
        { provide: 'entityManager', useValue: dataSource.createEntityManager() },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => jest.clearAllMocks());
  describe('login 테스트', () => {
    test('email 과 일치하는 유저가 없으면 해당 email 을 그대로 리턴한다.', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce([]);
      jest.spyOn(userRepository, 'save').mockResolvedValue();

      const result = await authService.login('test@email.com');

      expect(result).toEqual({ email: 'test@email.com' });
      expect(userRepository.save).not.toBeCalled();
    });

    test('email 과 일치하는 유저가 있으면 accessToken 과 refreshToken 을 리턴한다.', async () => {
      const user = plainToClass(User, {
        id: '1',
        email: 'test@email.com',
        password: 'qhupr22qp3ir23qrn2-23rnj1p',
        nickname: 'windy',
        provider: 'google',
        profileImage: 'test',
        profiles: [
          plainToClass(Profile, {
            id: '1',
            career: 1,
            job: 'backendDeveloper',
            introduction: 'Hello world!',
            urls: ['https://github.com/yoon-bomi'],
            stacks: [1, 6, 22],
          }),
        ],
      });

      jest.spyOn(userRepository, 'find').mockResolvedValueOnce([user]);
      jest.spyOn(userRepository, 'save').mockResolvedValue();

      expect(user.refreshToken).toBeUndefined();

      const result = await authService.login('test@email.com');

      expect(userRepository.save).toHaveBeenCalledWith([
        {
          ...user,
          refreshToken: 'TOKEN',
        },
      ]);
      expect(user.refreshToken).toEqual('TOKEN');
      expect(result).toEqual({
        accessToken: 'TOKEN',
        refreshToken: 'TOKEN',
      });
    });
  });

  describe('revise 테스트', () => {
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
    test('token이 들어오면 유저의 refreshToken을 갱신해야한다.', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([user]);
      jest.spyOn(userRepository, 'save');
      await authService.revise('oldRefreshToken');

      expect(userRepository.save).toBeCalledTimes(1);
      expect(userRepository.save).toBeCalledWith([{ ...user, refreshToken: 'TOKEN' }]);
    });
    test('token에 해당하는 유저가 없다면 에러를 던져야한다.', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([]);

      expect.assertions(1);
      try {
        await authService.revise('oldRefreshToken');
      } catch (err) {
        expect(err).toEqual(badRequest('유저를 찾을 수 없습니다.'));
      }
    });
  });
});
