import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { AuthService } from '../../services/auth/application/service';
import { UserRepository } from '../../services/users/infrastructure/repository';
import { UserGuard } from './guard';
import { dataSource } from '../orm';

describe('user guard test', () => {
  let userGuard: UserGuard;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        UserRepository,
        AuthService,
        UserGuard,
        { provide: 'entityManager', useValue: dataSource.createEntityManager() },
      ],
    }).compile();
    userGuard = module.get<UserGuard>(UserGuard);
  });

  test('access token이나 refresh token이 담겨있지 않으면 undefined 를 반환한다.', async () => {
    const mockContext = createMock<ExecutionContext>();
    mockContext.switchToHttp().getRequest.mockReturnValue({
      signedCookies: {},
    });

    expect(await userGuard.canActivate(mockContext)).toBe(true);
    // @ts-expect-error
    expect(mockContext.switchToHttp().getRequest().state.user).toBeUndefined();
  });
});
