import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { customAlphabet } from 'nanoid';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../users/infrastructure/repository';
import { VerificationService } from './service';
import { dataSource } from '../../../libs/orm';
import { plainToClass } from '../../../libs/test';
import { Profile, User } from '../../users/domain/model';
import { VerificationRepository } from '../infrastructure/repository';
import { badRequest } from '../../../libs/exception';
import { Verification } from '../domain/model';

jest.mock('../../users/infrastructure/repository');
jest.mock('../infrastructure/repository');
jest.mock('@nestjs-modules/mailer');
jest.mock('nanoid');

describe('VerificationService 테스트', () => {
  let verificationService: VerificationService;
  let verificationRepository: VerificationRepository;
  let userRepository: UserRepository;
  let mailerService: MailerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        VerificationService,
        UserRepository,
        VerificationRepository,
        MailerService,
        { provide: 'entityManager', useValue: dataSource.createEntityManager() },
      ],
    }).compile();
    verificationService = module.get<VerificationService>(VerificationService);
    userRepository = module.get<UserRepository>(UserRepository);
    mailerService = module.get<MailerService>(MailerService);
    verificationRepository = module.get<VerificationRepository>(VerificationRepository);
  });

  beforeEach(() => {
    const mockedCustomAlphabet = customAlphabet as jest.Mock<() => string>;
    mockedCustomAlphabet.mockImplementation(() => () => '222222');
    jest.useFakeTimers().setSystemTime(new Date('2023-03-23T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  const user = plainToClass(User, {
    id: 'nanoid',
    email: 'test@email.com',
    password: 'password',
    nickname: 'arthur',
    profileImage: '',
    provider: 'link-gather',
    profiles: [
      plainToClass(Profile, {
        id: '1',
        career: 1,
        job: 'backendDeveloper',
        introduction: 'Hello world!',
        urls: ['https://github.com/Link-Gather'],
        stacks: [1, 6, 22],
      }),
    ],
  });

  const verification = plainToClass(Verification, {
    id: 'nanoid',
    email: 'test@email.com',
    code: 'verificationCode',
    expiredAt: new Date('2023-03-24T00:00:00.000Z'),
    type: 'signup',
  });

  describe('start test', () => {
    test('이메일 인증을 시작하면 verification을 생성하고 mail을 보낸다.', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([]);

      await verificationService.start({ email: 'test@email.com', type: 'signup' });
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith([
        { code: '222222', email: 'test@email.com', expiredAt: new Date('2023-03-23T00:03:00.000Z'), type: 'signup' },
      ]);
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
    });

    test('이메일이 이미 있으면 에러를 던져야 한다.', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([user]);

      expect.assertions(1);
      try {
        await verificationService.start({ email: 'test@email.com', type: 'signup' });
      } catch (err) {
        expect(err).toEqual(badRequest(`Invalid email(test@email.com) is entered. Please check the email.`));
      }
    });
  });

  describe('confirm test', () => {
    test('code를 입력하면 이메일에 해당하는 verification의 코드와 비교한다.', async () => {
      jest.spyOn(verificationRepository, 'findSpec').mockResolvedValue([verification]);
      jest.spyOn(verificationRepository, 'save');

      await verificationService.confirm({ code: 'verificationCode', id: 'X1ctfskzB_E3hums84rTESTcF__CD' });
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith([
        {
          code: 'verificationCode',
          email: 'test@email.com',
          expiredAt: new Date('2023-03-24T00:00:00.000Z'),
          id: 'nanoid',
          verifiedAt: new Date('2023-03-23T00:00:00.000Z'),
          type: 'signup',
        },
      ]);
    });
  });

  describe('isValidVerification test', () => {
    test('verification이 없으면 에러를 뱉는다.', async () => {
      jest.spyOn(verificationRepository, 'findSpec').mockResolvedValue([]);
      expect.assertions(1);
      try {
        await verificationService.isValidVerification('X1ctfskzB_E3hums84rTESTcF__CD');
      } catch (err) {
        expect(err).toEqual(
          badRequest(`Invalid verificationId(X1ctfskzB_E3hums84rTESTcF__CD) is entered.`, {
            errorMessage: '잘못된 URL입니다. 다시한번 인증을 진행해주세요.',
          }),
        );
      }
    });
  });

  describe('changePassword test', () => {
    test('비밀번호를 변경할 수 있다.', async () => {
      jest.spyOn(verificationRepository, 'findSpec').mockResolvedValue([verification]);
      jest.spyOn(verificationRepository, 'save');
      jest.spyOn(userRepository, 'find').mockResolvedValue([user]);
      jest.spyOn(userRepository, 'save');
      jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => Promise.resolve('$2b$10$5CW3ftestSaltJ9wpFAShe'));
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('encrypt password'));

      await verificationService.changePassword({
        id: 'X1ctfskzB_E3hums84rTESTcF__CD',
        password: 'newPassword',
        passwordConfirm: 'newPassword',
      });

      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith([{ ...user, password: 'encrypt password' }]);
      expect(verificationRepository.save).toHaveBeenCalledWith([
        { ...verification, verifiedAt: new Date('2023-03-23T00:00:00.000Z') },
      ]);
    });
  });
});
