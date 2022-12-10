import { customAlphabet } from 'nanoid';
import { User } from './model';

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
      provider: 'Link-Gather',
      career: 1,
      job: 'Developer',
      introduction: 'link-gather creator',
      stacks: ['node.js', 'typescript', 'react.js'],
      urls: ['https://github.com/changchanghwang'],
    });

    expect(user).toEqual({
      email: 'email@test.com',
      id: 'nanoid',
      introduction: 'link-gather creator',
      nickname: 'arthur',
      password: 'qhupr22qp3ir23qrn2-23rnj1p',
      profile: 'linkgather image url',
      provider: 'Link-Gather',
      stacks: ['node.js', 'typescript', 'react.js'],
      urls: ['https://github.com/changchanghwang'],
    });
  });
});
