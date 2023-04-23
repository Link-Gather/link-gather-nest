import { Test, TestingModule } from '@nestjs/testing';
import { forbidden } from '../../../../libs/exception';
import { dataSource } from '../../../../libs/orm';
import { plainToClass } from '../../../../libs/test';
import { VerificationRepository } from '../../infrastructure/repository';
import { Verification } from '../model';
import { ValidVerificationSpec } from './valid-verification-spec';

describe('ValidVerificationSpec test', () => {
  let verificationRepository: VerificationRepository;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [VerificationRepository, { provide: 'entityManager', useValue: dataSource.createEntityManager() }],
    }).compile();
    verificationRepository = module.get<VerificationRepository>(VerificationRepository);
  });

  beforeEach(() => jest.useFakeTimers().setSystemTime(new Date('2023-03-28T09:00:00.000Z')));
  afterEach(() => jest.clearAllTimers());

  const verification = plainToClass(Verification, {
    id: 1,
    email: 'test@email.com',
    code: 'verificationCode',
    expiredAt: new Date('2023-03-29T00:00:00.000Z'),
    type: 'signup',
  });

  test('verification을 조회할 수 있다.', async () => {
    const verificationRepositoryFindSpyOn = jest
      .spyOn(verificationRepository, 'find')
      .mockResolvedValue([verification]);

    const spec = new ValidVerificationSpec({ id: 0 });
    await spec.find(verificationRepository);

    expect(verificationRepositoryFindSpyOn.mock.calls).toHaveLength(1);
    expect(verificationRepositoryFindSpyOn.mock.calls[0][0]).toEqual({ id: 0 });
  });

  test('verification의 유효기간이 지났다면 에러를 던져야한다.', async () => {
    jest.spyOn(verificationRepository, 'find').mockResolvedValue([
      plainToClass(Verification, {
        ...verification,
        expiredAt: new Date('2023-03-28T00:00:00.000Z'),
      }),
    ]);
    expect.assertions(1);
    const spec = new ValidVerificationSpec({ id: 0 });
    try {
      await spec.find(verificationRepository);
    } catch (err) {
      expect(err).toEqual(
        forbidden(`Verification(${verification.id}) is expired.`, {
          errorMessage: '인증 코드가 만료되었습니다. 다시 인증해주세요.',
        }),
      );
    }
  });

  test('verification이 이미 인증을 한 verification이라면 에러를 던져야한다.', async () => {
    jest.spyOn(verificationRepository, 'find').mockResolvedValue([
      plainToClass(Verification, {
        ...verification,
        verifiedAt: new Date('2023-04-23T00:00:00.000Z'),
      }),
    ]);
    expect.assertions(1);
    const spec = new ValidVerificationSpec({ id: 0 });
    try {
      await spec.find(verificationRepository);
    } catch (err) {
      expect(err).toEqual(
        forbidden(`Verification(${verification.id}) is already verified.`, {
          errorMessage: '이미 인증된 인증코드입니다. 다시 인증해주세요.',
        }),
      );
    }
  });
});
