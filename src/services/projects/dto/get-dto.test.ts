import { validate } from 'class-validator';
import { ListQueryDto, ListResponseDto } from './get-dto';
import { plainToInstance } from '../../../libs/test';

describe('get dto 테스트', () => {
  test('ListQueryDto 테스트', async () => {
    const dto = plainToInstance(ListQueryDto, {
      stacks: ['1'],
      job: 'backendDeveloper',
      order: 'popularity',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  test('ListResponseDto 테스트', async () => {
    const dto = plainToInstance(ListResponseDto, {
      id: 'A_23QD428',
      title: 'project',
      description: 'side project!',
      purpose: 'study',
      isRecruiting: true,
      recruitMember: { frontendDeveloper: 2, backendDeveloper: 2, designer: 1, productManager: 1 },
      members: [
        {
          id: 'b-24nT302A',
          email: 'test@test.com',
          nickname: 'windy',
          profileImage: 'http://www.link-gather.co.kr/s3/profile-image',
          provider: 'kakao',
          job: 'backendDeveloper',
          type: 'leader',
        },
        {
          id: 'BA2J3vE1_0',
          email: 'member@test.com',
          nickname: 'liz',
          profileImage: 'http://www.link-gather.co.kr/s3/profile-image',
          provider: 'kakao',
          job: 'productManager',
          type: 'member',
        },
      ],
      status: 'recruiting',
      period: 2,
      stacks: [3, 4],
      bookMarkCount: 0,
      startDate: new Date('2023-06-10'),
      endDate: new Date('2023-06-10'),
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
