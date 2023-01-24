import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../users/infrastructure/repository';
import { AuthService } from './service';
import { dataSource } from '../../../libs/orm';
import { Profile, User } from '../../users/domain/model';
import { plainToClass } from '../../../test';

const mockJwtService = {
  sign: jest.fn(() => 'TOKEN'),
  verify: jest.fn(() => 'verify'),
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

  describe('login 테스트', () => {
    test('email 과 일치하는 유저가 없으면 해당 email 을 그대로 리턴한다.', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce([]);

      const result = await authService.login('test@email.com');

      expect(result).toEqual({ email: 'test@email.com' });
    });

    test('email 과 일치하는 유저가 있으면 accessToken 과 refreshToken 을 리턴한다.', async () => {
      const user = plainToClass(User, {
        id: '1',
        email: 'test@email.com',
        password: 'qhupr22qp3ir23qrn2-23rnj1p',
        nickname: 'windy',
        provider: 'google',
        career: 1,
        job: 'Developer',
        introduction: 'Hello world!',
        stacks: ['node.js', 'typescript', 'react.js'],
        urls: ['https://github.com/yoon-bomi'],
        profileImage: 'test',
        profiles: [
          plainToClass(Profile, {
            id: '1',
            career: 1,
            job: 'Developer',
            introduction: 'Hello world!',
            urls: ['https://github.com/yoon-bomi'],
            stacks: ['node.js', 'typescript', 'react.js'],
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
});
