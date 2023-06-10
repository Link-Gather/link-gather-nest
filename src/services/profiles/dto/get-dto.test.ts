import { validate } from 'class-validator';
import { plainToInstance } from '../../../libs/test';
import { ListQueryDto, ListResponseDto } from './get-dto';

describe('get dto 테스트', () => {
  test('ListQueryDto 테스트', async () => {
    const dto = plainToInstance(ListQueryDto, {
      stacks: [1, 2, 3, 45, 5],
      job: 'backendDeveloper',
      page: '1',
      limit: '8',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  test('ListResponseDto 테스트', async () => {
    const dto = new ListResponseDto({
      id: 'asdf12',
      stacks: [1, 3, 345, 75, 765],
      job: 'backendDeveloper',
      career: 3,
      introduction: 'I am developer',
      urls: ['https://www.naver.com'],
      nickname: 'arthur',
      userId: 'userId',
      profileImage: 'profileImage',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
