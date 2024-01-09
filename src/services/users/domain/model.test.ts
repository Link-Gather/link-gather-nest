import { nanoid } from 'nanoid';
import { plainToClass } from '@libs/test';
import { compareHash } from '@libs/password';
import { badRequest } from '@libs/exception';
import { User } from './model';

jest.mock('nanoid');
jest.mock('../../../libs/password');

describe('User 테스트', () => {
  beforeEach(() => {
    const mockedNanoid = nanoid as jest.Mock<string>;
    mockedNanoid.mockImplementation(() => 'IRFa-VaY2b');
  });
  test('User 생성 테스트', () => {
    const user = new User({
      email: 'email@test.com',
      password: 'qhupr22qp3ir23qrn2-23rnj1p',
      nickname: 'arthur',
      provider: 'link-gather',
      profileImage: 'linkgather image url',
    });

    expect(user).toEqual({
      email: 'email@test.com',
      id: 'IRFa-VaY2b',
      nickname: 'arthur',
      password: 'qhupr22qp3ir23qrn2-23rnj1p',
      profileImage: 'linkgather image url',
      provider: 'link-gather',
    });
  });
  describe('validatePassword test', () => {
    const user = plainToClass(User, {
      email: 'email@test.com',
      id: 'IRFa-VaY2b',
      nickname: 'arthur',
      password: expect.not.stringMatching('qhupr22qp3ir23qrn2-23rnj1p'),
      profileImage: 'image url',
      provider: 'link-gather',
    });
    test('패스워드가 일치하면 성공', async () => {
      const mockedCompareHash = compareHash as jest.Mock;
      mockedCompareHash.mockImplementation(async () => true);

      expect.assertions(0);
      try {
        await user.validatePassword('password');
      } catch (err) {
        expect(err).toEqual(
          badRequest('패스워드가 일치하지 않습니다.', {
            errorMessage: '이메일이나 패스워드가 일치하지 않습니다.',
          }),
        );
      }
    });
    test('패스워드가 일치하지않으면 에러를 뱉어야한다.', async () => {
      const mockedCompareHash = compareHash as jest.Mock;
      mockedCompareHash.mockImplementation(async () => false);

      expect.assertions(1);
      try {
        await user.validatePassword('password');
      } catch (err) {
        expect(err).toEqual(
          badRequest('패스워드가 일치하지 않습니다.', {
            errorMessage: '이메일이나 패스워드가 일치하지 않습니다.',
          }),
        );
      }
    });
  });

  describe('changePassword test', () => {
    const user = plainToClass(User, {
      email: 'email@test.com',
      id: 'IRFa-VaY2b',
      nickname: 'arthur',
      password: expect.not.stringMatching('qhupr22qp3ir23qrn2-23rnj1p'),
      profileImage: 'image url',
      provider: 'link-gather',
    });

    test('비밀번호와 비밀번호확인이 일치하지 않으면 에러를 뱉는다.', async () => {
      expect.assertions(1);
      try {
        await user.changePassword({ password: 'new', passwordConfirm: 'new2' });
      } catch (err) {
        expect(err).toEqual(
          badRequest(`Password(new) is not equal to PasswordConfirm(new2)`, {
            errorMessage: `비밀번호와 비밀번호 확인이 일치하지 않습니다.`,
          }),
        );
      }
    });

    describe('provider가 link-gather가 아니면 에러를 뱉는다.', () => {
      test('provider === google', async () => {
        const googleUser = plainToClass(User, {
          ...user,
          provider: 'google',
        });

        expect.assertions(1);
        try {
          await googleUser.changePassword({ password: 'new', passwordConfirm: 'new' });
        } catch (err) {
          expect(err).toEqual(
            badRequest(`Invalid provider(google) is entered. Only link-gather can change password`, {
              errorMessage: '비밀번호를 변경할 수 없는 계정입니다.',
            }),
          );
        }
      });
      test('provider === kakao', async () => {
        const kakaoUser = plainToClass(User, {
          ...user,
          provider: 'kakao',
        });

        expect.assertions(1);
        try {
          await kakaoUser.changePassword({ password: 'new', passwordConfirm: 'new' });
        } catch (err) {
          expect(err).toEqual(
            badRequest(`Invalid provider(kakao) is entered. Only link-gather can change password`, {
              errorMessage: '비밀번호를 변경할 수 없는 계정입니다.',
            }),
          );
        }
      });
      test('provider === github', async () => {
        const githubUser = plainToClass(User, {
          ...user,
          provider: 'github',
        });

        expect.assertions(1);
        try {
          await githubUser.changePassword({ password: 'new', passwordConfirm: 'new' });
        } catch (err) {
          expect(err).toEqual(
            badRequest(`Invalid provider(github) is entered. Only link-gather can change password`, {
              errorMessage: '비밀번호를 변경할 수 없는 계정입니다.',
            }),
          );
        }
      });
    });
  });
});
