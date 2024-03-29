import { forbidden } from '../../../libs/exception';
import { plainToClass } from '../../../libs/test';
import { Verification } from './model';

describe('Verification test', () => {
  const verification = plainToClass(Verification, {
    id: 'nanoid',
    email: 'test@email.com',
    code: 'verificationCode',
    expiredAt: new Date('2023-03-24T00:00:00.000Z'),
    type: 'signup',
  });

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2023-03-23T09:00:00.000Z'));
  });
  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('start method test', () => {
    test('verifiedAt를 입력해야한다.', () => {
      verification.verify();
      expect(verification.verifiedAt).toEqual(new Date('2023-03-23T09:00:00.000Z'));
    });
    test('코드가 있고 code가 같지 않다면 에러를 던져야 한다.', () => {
      expect.assertions(1);
      try {
        verification.verify('wrongCode');
      } catch (err) {
        expect(err).toEqual(forbidden(`Invalid Code(wrongCode) is entered.`));
      }
    });
  });
});
