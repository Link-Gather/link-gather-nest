import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { customAlphabet } from 'nanoid';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../infrastructure/repository';
import { UserService } from './service';
import { dataSource } from '../../../libs/orm';
import { Profile, User } from '../domain/model';

jest.mock('nanoid');

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

  beforeEach(() => {
    const mockedCustomAlphabet = customAlphabet as jest.Mock<() => string>;
    mockedCustomAlphabet.mockImplementation(() => () => 'nanoid');
  });

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
        id: 'nanoid',
        introduction: 'link-gather creator',
        job: 'Backend Developer',
        nickname: 'arthur',
        password: 'encrypt password',
        profileImage: 'image url',
        provider: 'link-gather',
        profiles: [
          {
            career: 1,
            id: 'nanoid',
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

    expect(userRepositoryFindSpy).toHaveBeenCalled();
    expect(bcryptHashSpy).toHaveBeenCalledWith('qhupr22qp3ir23qrn2-23rnj1p', '$2b$10$5CW3ftestSaltJ9wpFAShe');
  });

  test('이미 존재하는 이메일이면 에러를 던진다.', async () => {
    const user = plainToClass(User, {
      career: 1,
      email: 'email@test.com',
      id: 'nanoid',
      introduction: 'link-gather creator',
      job: 'Backend Developer',
      nickname: 'arthur',
      password: expect.not.stringMatching('qhupr22qp3ir23qrn2-23rnj1p'),
      profileImage: 'image url',
      provider: 'link-gather',
      profiles: [
        plainToClass(Profile, {
          career: 1,
          id: 'nanoid',
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

    expect(() =>
      userService.signUp({
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
      }),
    ).rejects.toThrow(new Error('이미 존재하는 이메일입니다.'));
  });
});
