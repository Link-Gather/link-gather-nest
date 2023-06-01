import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateBodyDto } from './post-dto';

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
      stacks: ['node.js'],
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
