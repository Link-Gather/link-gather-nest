import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../application/service';
import { UserController } from './controller';
import { UserRepository } from '../infrastructure/repository';
import { dataSource } from '../../../libs/orm';
import { plainToClass } from '../../../libs/test';
import { Profile, User } from '../domain/model';

jest.mock('../application/service');
describe('UserController test', () => {
  let userController: UserController;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        UserRepository,
        JwtService,
        { provide: 'entityManager', useValue: dataSource.createEntityManager() },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

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

  describe('signIn test', () => {
    test('로그인에 성공하면 cookie에 accessToken, refreshToken을 만들어준다.', async () => {
      const mockContext = createMock<ExecutionContext>();

      const userServicesignInSpyOn = jest
        .spyOn(userService, 'signIn')
        .mockResolvedValue({ accessToken: 'accessToken', refreshToken: 'refreshToken', user });
      // @ts-expect-error
      await userController.signIn({ email: 'email', password: 'password' }, mockContext.switchToHttp().getResponse());
      expect(userServicesignInSpyOn.mock.calls).toHaveLength(1);
      expect(userServicesignInSpyOn.mock.calls[0][0]).toEqual({ email: 'email', password: 'password' });
      // @ts-expect-error
      expect(mockContext.switchToHttp().getResponse().cookie).toHaveBeenCalledTimes(2);
    });
  });
});
