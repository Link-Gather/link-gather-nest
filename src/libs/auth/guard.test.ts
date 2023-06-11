import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { AuthService } from '../../services/auth/application/service';
import { UserRepository } from '../../services/users/infrastructure/repository';
import { AuthGuard } from './guard';
import { plainToClass } from '../test';
import { User } from '../../services/users/domain/model';
import { dataSource } from '../orm';
import { unauthorized } from '../exception';

describe('auth guard test', () => {
  let authGuard: AuthGuard;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let authService: AuthService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        UserRepository,
        AuthService,
        AuthGuard,
        { provide: 'entityManager', useValue: dataSource.createEntityManager() },
      ],
    }).compile();
    authGuard = module.get<AuthGuard>(AuthGuard);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
    authService = module.get<AuthService>(AuthService);
  });

  const user = plainToClass(User, {
    id: 'userId',
    email: 'test@test.com',
    password: 'password',
    nickname: 'arthur',
    profileImage: '',
    provider: 'link-gather',
  });

  describe('access token 관련 로직 테스트', () => {
    test('정상적인 access token이 올 경우 req.state에 user를 주입하고 true를 반환한다.', async () => {
      const mockContext = createMock<ExecutionContext>();
      mockContext.switchToHttp().getRequest.mockReturnValue({
        signedCookies: {
          accessToken: 'Bearer accessToken',
        },
      });
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ id: 'userId' });
      jest.spyOn(userRepository, 'findOneOrFail').mockResolvedValue(user);

      expect(await authGuard.canActivate(mockContext)).toBe(true);
      // @ts-expect-error
      expect(mockContext.switchToHttp().getRequest().state.user).toEqual(user);
    });

    test('access token이 유저를 찾지 못하면 에러를 반환한다.', async () => {
      const mockContext = createMock<ExecutionContext>();
      mockContext.switchToHttp().getRequest.mockReturnValue({
        signedCookies: {
          accessToken: 'Bearer accessToken',
        },
      });
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ id: 'userId' });
      jest.spyOn(userRepository, 'findOneOrFail').mockRejectedValue(new EntityNotFoundError(User, 'userId'));
      expect.assertions(1);
      try {
        await authGuard.canActivate(mockContext);
      } catch (err) {
        expect(err).toEqual(new EntityNotFoundError(User, 'userId'));
      }
    });

    test('access token의 타입이 bearer가 아닌 경우 error를 반환한다.', async () => {
      const mockContext = createMock<ExecutionContext>();
      mockContext.switchToHttp().getRequest.mockReturnValue({
        signedCookies: {
          accessToken: 'accessToken',
        },
      });

      expect.assertions(1);
      try {
        await authGuard.canActivate(mockContext);
      } catch (err) {
        expect(err).toEqual(
          unauthorized(`Token type(accessToken) is not 'Bearer'`, { errorMessage: '토큰 타입이 잘못 되었습니다.' }),
        );
      }
    });

    describe('refresh token 관련 로직 테스트', () => {
      test('accessToken이 만료되었으면 refreshToken으로 revise를 호출한다.', async () => {
        const mockContext = createMock<ExecutionContext>();
        mockContext.switchToHttp().getRequest.mockReturnValue({
          signedCookies: {
            accessToken: 'Bearer accessToken',
            refreshToken: 'Bearer refreshToken',
          },
        });
        jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue({ message: 'jwt expired' });
        jest
          .spyOn(authService, 'revise')
          .mockResolvedValue({ accessToken: 'accessToken', refreshToken: 'new refreshToken', user });

        await authGuard.canActivate(mockContext);

        // @ts-expect-error
        expect(mockContext.switchToHttp().getRequest().state.user).toEqual(user);
        // @ts-expect-error
        expect(mockContext.switchToHttp().getResponse().cookie).toBeCalledTimes(2);
      });

      test('refresh token의 타입이 bearer가 아닌 경우 error를 반환한다.', async () => {
        const mockContext = createMock<ExecutionContext>();
        mockContext.switchToHttp().getRequest.mockReturnValue({
          signedCookies: {
            accessToken: 'Bearer accessToken',
            refreshToken: 'refreshToken',
          },
        });
        jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue({ message: 'jwt expired' });

        expect.assertions(1);
        try {
          await authGuard.canActivate(mockContext);
        } catch (err) {
          expect(err).toEqual(
            unauthorized(`Token type(refreshToken) is not 'Bearer'`, { errorMessage: '토큰 타입이 잘못 되었습니다.' }),
          );
        }
      });
    });
  });

  test('access token이나 refresh token이 담겨있지 않으면 false를 반환한다.', async () => {
    const mockContext = createMock<ExecutionContext>();
    mockContext.switchToHttp().getRequest.mockReturnValue({
      signedCookies: {},
    });
    try {
      await authGuard.canActivate(mockContext);
    } catch (err) {
      expect(err).toEqual(unauthorized('Authentication failed.', { errorMessage: '권한 인증에 실패했습니다.' }));
    }
  });
});
