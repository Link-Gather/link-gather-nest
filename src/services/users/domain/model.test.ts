import { plainToClass } from 'class-transformer';
import { nanoid } from 'nanoid';
import { Profile, User } from './model';
import { compareHash } from '../../../libs/password';
import { badRequest } from '../../../libs/exception';

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
      career: 1,
      job: 'Backend Developer',
      introduction: 'link-gather creator',
      stacks: ['node.js', 'typescript', 'react.js'],
      urls: ['https://github.com/changchanghwang'],
      profileImage: 'linkgather image url',
    });

    expect(user).toEqual({
      email: 'email@test.com',
      id: 'IRFa-VaY2b',
      nickname: 'arthur',
      password: 'qhupr22qp3ir23qrn2-23rnj1p',
      profileImage: 'linkgather image url',
      provider: 'link-gather',
      profiles: [
        plainToClass(Profile, {
          career: 1,
          id: 'IRFa-VaY2b',
          introduction: 'link-gather creator',
          job: 'Backend Developer',
          stacks: ['node.js', 'typescript', 'react.js'],
          urls: ['https://github.com/changchanghwang'],
        }),
      ],
    });
  });
  describe('validatePassword test', () => {
    const user = plainToClass(User, {
      career: 1,
      email: 'email@test.com',
      id: 'IRFa-VaY2b',
      introduction: 'link-gather creator',
      job: 'Backend Developer',
      nickname: 'arthur',
      password: expect.not.stringMatching('qhupr22qp3ir23qrn2-23rnj1p'),
      profileImage: 'image url',
      provider: 'link-gather',
      profiles: [
        plainToClass(Profile, {
          career: 1,
          id: 'IRFa-VaY2b',
          introduction: 'link-gather creator',
          job: 'Backend Developer',
          stacks: ['node.js', 'typescript', 'react.js'],
          urls: ['https://github.com/changchanghwang'],
        }),
      ],
      stacks: ['node.js', 'typescript', 'react.js'],
      urls: ['https://github.com/changchanghwang'],
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
});
