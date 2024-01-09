import { validate } from 'class-validator';
import { plainToInstance } from '@libs/test';
import { ClickParamDto } from './post-dto';

describe('post dto 테스트', () => {
  test('CreateBodyDto 테스트', async () => {
    const dto = plainToInstance(ClickParamDto, {
      projectId: '1',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
