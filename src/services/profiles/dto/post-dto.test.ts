import { validate } from 'class-validator';
import { plainToInstance } from '@libs/test';
import { CreateBodyDto } from './post-dto';

describe('post dto 테스트', () => {
  test('CreateBodyDto 테스트', async () => {
    const dto = plainToInstance(CreateBodyDto, {
      stacks: [1, 1, 2, 56, 4567, 86],
      job: 'backendDeveloper',
      career: 1,
      introduction: 'I am developer',
      urls: ['https://github.com/Link-Gather'],
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
