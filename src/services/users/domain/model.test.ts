import { plainToClass } from 'class-transformer';
import { customAlphabet } from 'nanoid';
import { Profile, User } from './model';

jest.mock('nanoid');

describe('User 테스트', () => {
  beforeEach(() => {
    const mockedCustomAlphabet = customAlphabet as jest.Mock<() => string>;
    mockedCustomAlphabet.mockImplementation(() => () => 'nanoid');
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
      id: 'nanoid',
      introduction: 'link-gather creator',
      career: 1,
      nickname: 'arthur',
      password: 'qhupr22qp3ir23qrn2-23rnj1p',
      job: 'Backend Developer',
      profileImage: 'linkgather image url',
      provider: 'link-gather',
      stacks: ['node.js', 'typescript', 'react.js'],
      urls: ['https://github.com/changchanghwang'],
      profiles: [
        plainToClass(Profile, {
          career: 1,
          id: 'nanoid',
          introduction: 'link-gather creator',
          job: 'Backend Developer',
          stacks: ['node.js', 'typescript', 'react.js'],
          urls: ['https://github.com/changchanghwang'],
        }),
      ],
    });
  });
});
