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
    test('verficationService.verifyEmail을 호출한다.', async () => {
      const verificationServiceVerifyEmailSpyOn = jest
        .spyOn(verificationService, 'verifyEmail')
        .mockResolvedValue({ id: 0 });

      await authController.verifyEmail({ email: 'hch950627@naver.com' });

      expect(verificationServiceVerifyEmailSpyOn.mock.calls).toHaveLength(1);
      expect(verificationServiceVerifyEmailSpyOn.mock.calls[0][0]).toBe('hch950627@naver.com');
    });
  });
  describe('POST /email-verification/:id/confirm test', () => {
    test('verficationService.confirm 호출한다.', async () => {
      const verificationServiceConfirmSpyOn = jest.spyOn(verificationService, 'confirm');

      await authController.verifyEmailConfirm({ id: 'verificationId' }, { code: '123456' });

      expect(verificationServiceConfirmSpyOn.mock.calls).toHaveLength(1);
      expect(verificationServiceConfirmSpyOn.mock.calls[0][0]).toEqual({
        id: 'verificationId',
        code: '123456',
      });
    });
  });
});
