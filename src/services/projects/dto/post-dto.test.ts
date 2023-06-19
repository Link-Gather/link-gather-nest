import { validate } from 'class-validator';
import { CreateBodyDto } from './post-dto';
import { plainToInstance } from '../../../libs/test';

describe('post dto 테스트', () => {
  test('CreateBodyDto 테스트', async () => {
    const dto = plainToInstance(CreateBodyDto, {
      title: 'title',
      description: 'description',
      purpose: 'fun',
      recruitMember: {
        frontendDeveloper: 2,
        backendDeveloper: 2,
        designer: 1,
        productManager: 1,
      },
      period: 1,
      leaderJob: 'backendDeveloper',
      stacks: [1, 2],
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
