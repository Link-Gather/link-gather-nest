import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './controller';
import { VerificationService } from '../../verifications/application/service';
import { AuthService } from '../application/service';
import { UserRepository } from '../../users/infrastructure/repository';
import { VerificationRepository } from '../../verifications/infrastructure/repository';
import { dataSource } from '../../../libs/orm';

jest.mock('../../verifications/application/service');

describe('Auth Controller test', () => {
  let authController: AuthController;
  let verificationService: VerificationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserRepository,
        VerificationService,
        JwtService,
        VerificationRepository,
        { provide: 'entityManager', useValue: dataSource.createEntityManager() },
      ],
    }).compile();
    authController = module.get<AuthController>(AuthController);
    verificationService = module.get<VerificationService>(VerificationService);
  });

  describe('POST /email-verification test', () => {
    test('verificationService.start 호출한다.', async () => {
      const verificationServiceStartSpyOn = jest.spyOn(verificationService, 'start').mockResolvedValue({ id: 0 });

      await authController.verifyEmail({ email: 'hch950627@naver.com', type: 'signup' });

      expect(verificationServiceStartSpyOn.mock.calls).toHaveLength(1);
      expect(verificationServiceStartSpyOn.mock.calls[0][0]).toEqual({
        email: 'hch950627@naver.com',
        type: 'signup',
      });
    });
  });
  describe('POST /email-verification/:id test', () => {
    test('verificationService.confirm 호출한다.', async () => {
      const verificationServiceConfirmSpyOn = jest.spyOn(verificationService, 'confirm');

      await authController.verifyEmailConfirm({ id: '0' }, { code: '123456' });

      expect(verificationServiceConfirmSpyOn.mock.calls).toHaveLength(1);
      expect(verificationServiceConfirmSpyOn.mock.calls[0][0]).toEqual({
        id: 0,
        code: '123456',
      });
    });
  });

  describe('GET /email-verification/:id test', () => {
    test('verificationService.isValidVerification 호출한다.', async () => {
      const verificationServiceIsValidVerificationSpyOn = jest.spyOn(verificationService, 'isValidVerification');

      await authController.isValidVerification({ id: '0' });

      expect(verificationServiceIsValidVerificationSpyOn.mock.calls).toHaveLength(1);
      expect(verificationServiceIsValidVerificationSpyOn.mock.calls[0][0]).toBe(0);
    });
  });

  describe('PATCH /password-change/:verificationId test', () => {
    test('verificationService.changePassword 호출한다.', async () => {
      const verificationServiceChangePasswordSpyOn = jest.spyOn(verificationService, 'changePassword');

      await authController.changePassword(
        { verificationId: '0' },
        { password: 'password', passwordConfirm: 'password' },
      );

      expect(verificationServiceChangePasswordSpyOn.mock.calls).toHaveLength(1);
      expect(verificationServiceChangePasswordSpyOn.mock.calls[0][0]).toEqual({
        id: 0,
        password: 'password',
        passwordConfirm: 'password',
      });
    });
  });
});
