import { forbidden } from '../../../libs/exception';
import { plainToClass } from '../../../test';
import { Verification } from './model';

describe('Verification test', () => {
  const verification = plainToClass(Verification, {
    id: 1,
    email: 'test@email.com',
    code: 'verificationCode',
    expiredAt: new Date('2023-03-24T00:00:00.000Z'),
  });

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2023-03-23T09:00:00.000Z'));
  });
  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('verify method test', () => {
    test('코드를 받으면 verifiedAt를 입력해야한다.', () => {
      verification.verify('verificationCode');
      expect(verification.verifiedAt).toEqual(new Date('2023-03-23T09:00:00.000Z'));
    });
    test('expiredAt이 과거라면 에러를 던져야한다.', () => {
      const expiredVerification = plainToClass(Verification, {
        ...verification,
        expiredAt: new Date('2023-03-23T08:59:59.999Z'),
      });
      expect.assertions(1);
      try {
        expiredVerification.verify('verificationCode');
      } catch (err) {
        expect(err).toEqual(forbidden(`Verification(1) is expired.`));
      }
    });
    test('code가 같지 않다면 에러를 던져야 한다.', () => {
      expect.assertions(1);
      try {
        verification.verify('wrongCode');
      } catch (err) {
        expect(err).toEqual(forbidden(`Invalid Code(wrongCode) is entered.`));
      }
    });
  });
});
