import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { customAlphabet } from 'nanoid';
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
    introduction: 'hello world',
    career: 1,
    job: 'Backend Developer',
    stacks: ['Node.js'],
    urls: ['https://github.com/Link-Gather'],
    profiles: [
      plainToClass(Profile, {
        id: '1',
        career: 1,
        job: 'Backend Developer',
        introduction: 'Hello world!',
        urls: ['https://github.com/Link-Gather'],
        stacks: ['node.js'],
      }),
    ],
  });

  const verification = plainToClass(Verification, {
    id: 1,
    email: 'test@email.com',
    code: 'verificationCode',
    expiredAt: new Date('2023-03-24T00:00:00.000Z'),
  });

  describe('verifyEmail test', () => {
    test('이메일 인증을 시작하면 verification을 생성하고 mail을 보낸다.', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([]);

      await verificationService.verifyEmail('test@email.com');
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith([
        { code: '222222', email: 'test@email.com', expiredAt: new Date('2023-03-23T00:03:00.000Z') },
      ]);
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
    });

    test('이메일이 이미 있으면 에러를 던져야 한다.', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([user]);

      expect.assertions(1);
      try {
        await verificationService.verifyEmail('test@email.com');
      } catch (err) {
        expect(err).toEqual(badRequest(`Invalid email(test@email.com) is entered. Please check the email.`));
      }
    });
  });

  describe('confirm test', () => {
    test('code를 입력하면 이메일에 해당하는 verification의 코드와 비교한다.', async () => {
      jest.spyOn(verificationRepository, 'find').mockResolvedValue([verification]);
      jest.spyOn(verificationRepository, 'save');

      await verificationService.confirm({ code: 'verificationCode', id: 0 });
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith([
        {
          code: 'verificationCode',
          email: 'test@email.com',
          expiredAt: new Date('2023-03-24T00:00:00.000Z'),
          id: 1,
          verifiedAt: new Date('2023-03-23T00:00:00.000Z'),
        },
      ]);
    });
  });
});
