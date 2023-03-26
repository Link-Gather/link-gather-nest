import { Test, TestingModule } from '@nestjs/testing';
import { nanoid } from 'nanoid';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../infrastructure/repository';
import { UserService } from './service';
import { dataSource } from '../../../libs/orm';
import { Profile, User } from '../domain/model';
import { plainToClass } from '../../../libs/test';
import { unauthorized } from '../../../libs/exception';

jest.mock('nanoid');

describe('UserService 테스트', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        JwtService,
        { provide: 'entityManager', useValue: dataSource.createEntityManager() },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  beforeEach(() => {
    const mockedNanoid = nanoid as jest.Mock<string>;
    mockedNanoid.mockImplementation(() => 'IRFa-VaY2b');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp test', () => {
    test('신규 유저는 회원가입을 진행할 수 있다.', async () => {
      const userRepositorySaveSpy = jest.spyOn(userRepository, 'save').mockResolvedValue();
      const userRepositoryFindSpy = jest.spyOn(userRepository, 'find').mockResolvedValue([]);
      jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => Promise.resolve('$2b$10$5CW3ftestSaltJ9wpFAShe'));
      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('encrypt password'));

      await userService.signUp({
        email: 'email@test.com',
        password: 'qhupr22qp3ir23qrn2-23rnj1p',
        nickname: 'arthur',
        provider: 'link-gather',
        career: 1,
        job: 'Backend Developer',
        introduction: 'link-gather creator',
        stacks: ['node.js', 'typescript', 'react.js'],
        urls: ['https://github.com/changchanghwang'],
        profileImage: 'image url',
      });

      expect(userRepositorySaveSpy.mock.calls).toHaveLength(1);
      expect(userRepositorySaveSpy.mock.calls[0][0]).toEqual([
        {
          career: 1,
          email: 'email@test.com',
          id: 'IRFa-VaY2b',
          introduction: 'link-gather creator',
          job: 'Backend Developer',
          nickname: 'arthur',
          password: 'encrypt password',
          profileImage: 'image url',
          provider: 'link-gather',
          profiles: [
            {
              career: 1,
              id: 'IRFa-VaY2b',
              introduction: 'link-gather creator',
              job: 'Backend Developer',
              stacks: ['node.js', 'typescript', 'react.js'],
              urls: ['https://github.com/changchanghwang'],
            },
          ],
          stacks: ['node.js', 'typescript', 'react.js'],
          urls: ['https://github.com/changchanghwang'],
        },
      ]);

      expect(userRepositoryFindSpy).toHaveBeenCalledWith({ email: 'email@test.com' });
      expect(bcryptHashSpy).toHaveBeenCalledWith('qhupr22qp3ir23qrn2-23rnj1p', '$2b$10$5CW3ftestSaltJ9wpFAShe');
    });

    test('SNS 로 가입한 유저이면 nanoId 로 비밀번호를 새로 만들어준다.', async () => {
      const userRepositorySaveSpy = jest.spyOn(userRepository, 'save').mockResolvedValue();
      const userRepositoryFindSpy = jest.spyOn(userRepository, 'find').mockResolvedValue([]);
      jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => Promise.resolve('$2b$10$5CW3ftestSaltJ9wpFAShe'));
      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('encrypt password'));

      await userService.signUp({
        email: 'email@test.com',
        nickname: 'github user',
        provider: 'github',
        career: 1,
        job: 'Frontend Developer',
        introduction: 'sns user',
        stacks: ['typescript', 'react.js'],
        urls: ['https://github.com/'],
        profileImage: 'profile image',
      });

      expect(userRepositorySaveSpy.mock.calls).toHaveLength(1);
      expect(userRepositorySaveSpy.mock.calls[0][0]).toEqual([
        {
          career: 1,
          email: 'email@test.com',
          id: 'IRFa-VaY2b',
          introduction: 'sns user',
          job: 'Frontend Developer',
          nickname: 'github user',
          password: 'encrypt password',
          profileImage: 'profile image',
          provider: 'github',
          profiles: [
            {
              career: 1,
              id: 'IRFa-VaY2b',
              introduction: 'sns user',
              job: 'Frontend Developer',
              stacks: ['typescript', 'react.js'],
              urls: ['https://github.com/'],
            },
          ],
          stacks: ['typescript', 'react.js'],
          urls: ['https://github.com/'],
        },
      ]);

      expect(userRepositoryFindSpy).toHaveBeenCalledWith({ email: 'email@test.com' });
      expect(bcryptHashSpy).toHaveBeenCalledWith('IRFa-VaY2b', '$2b$10$5CW3ftestSaltJ9wpFAShe');
    });

    test('이미 존재하는 이메일이면 에러를 던진다.', async () => {
      const user = plainToClass(User, {
        career: 1,
        email: 'email@test.com',
        id: 'IRFa-VaY2b',
        introduction: 'link-gather creator',
        job: 'Backend Developer',
        nickname: 'arthur',
        password: expect.not.stringMatching('qhupr22qp3ir23qrn2-23rnj1p'),
        profileImage: 'image url',
        provider: 'link-gather',
        profiles: [
          plainToClass(Profile, {
            career: 1,
            id: 'IRFa-VaY2b',
            introduction: 'link-gather creator',
            job: 'Backend Developer',
            stacks: ['node.js', 'typescript', 'react.js'],
            urls: ['https://github.com/changchanghwang'],
          }),
        ],
        stacks: ['node.js', 'typescript', 'react.js'],
        urls: ['https://github.com/changchanghwang'],
      });

      jest.spyOn(userRepository, 'find').mockResolvedValue([user]);

      expect.assertions(1);

      try {
        await userService.signUp({
          email: 'email@test.com',
          password: 'testpassword1234',
          nickname: 'windy',
          provider: 'kakao',
          career: 1,
          job: 'Backend Developer',
          introduction: 'link-gather creator',
          stacks: ['node.js', 'typescript', 'react.js'],
          urls: ['https://github.com/changchanghwang'],
          profileImage: 'image url',
        });
      } catch (err) {
        expect(err).toEqual(unauthorized('이미 존재하는 이메일입니다.'));
      }
    });
  });

  describe('signIn test', () => {
    const user = plainToClass(User, {
      career: 1,
      email: 'email@test.com',
      id: 'IRFa-VaY2b',
      introduction: 'link-gather creator',
      job: 'Backend Developer',
      nickname: 'arthur',
      password: expect.not.stringMatching('qhupr22qp3ir23qrn2-23rnj1p'),
      profileImage: 'image url',
      provider: 'link-gather',
      profiles: [
        plainToClass(Profile, {
          career: 1,
          id: 'IRFa-VaY2b',
          introduction: 'link-gather creator',
          job: 'Backend Developer',
          stacks: ['node.js', 'typescript', 'react.js'],
          urls: ['https://github.com/changchanghwang'],
        }),
      ],
      stacks: ['node.js', 'typescript', 'react.js'],
      urls: ['https://github.com/changchanghwang'],
    });

    test('이메일, 패스워드가 일치한다면 refreshToken을 업데이트 한 후, accessToken, refreshToken을 반환해야한다.', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([user]);
      jest.spyOn(user, 'validatePassword').mockResolvedValue();
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('accessToken');
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('refreshToken');
      const userRepositorySaveSpy = jest.spyOn(userRepository, 'save');

      await userService.signIn({ email: 'email@test.com', password: 'test' });
      expect(userRepositorySaveSpy.mock.calls).toHaveLength(1);
      expect(userRepositorySaveSpy.mock.calls[0][0]).toEqual(
        expect.arrayContaining([expect.objectContaining({ refreshToken: 'refreshToken' })]),
      );
    });
  });

  describe('nickname duplicated check 테스트', () => {
    test('이미 사용중인 닉네임이면 true 를 반환한다.', async () => {
      const user = plainToClass(User, {
        career: 1,
        email: 'email@test.com',
        id: 'IRFa-VaY2b',
        introduction: 'link-gather creator',
        job: 'Backend Developer',
        nickname: 'windy',
        password: expect.not.stringMatching('qhupr22qp3ir23qrn2-23rnj1p'),
        profileImage: 'image url',
        provider: 'link-gather',
        profiles: [
          plainToClass(Profile, {
            career: 1,
            id: 'IRFa-VaY2b',
            introduction: 'link-gather creator',
            job: 'Backend Developer',
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
