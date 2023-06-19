import { validate } from 'class-validator';
import { RetrieveResponseDto } from './get-dto';

describe('get dto 테스트', () => {
  test('RetrieveResponseDto 테스트', async () => {
    const dto = new RetrieveResponseDto({
      id: 'test9',
      email: 'test@naver.com',
      nickname: 'windy',
      provider: 'kakao',
      profileImage: 'http://www.link-gather.co.kr/s3/profile-image',
      profiles: [
        {
          id: 'asdf12',
          stacks: [1, 3, 345, 75, 765],
          job: 'backendDeveloper',
          career: 3,
          introduction: 'I am developer',
          urls: ['https://www.naver.com'],
          userId: 'userId',
        },
      ],
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
