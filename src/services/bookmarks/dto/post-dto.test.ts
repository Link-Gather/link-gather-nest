import { validate } from 'class-validator';
import { ClickParamDto } from './post-dto';
import { plainToInstance } from '../../../libs/test';

describe('post dto 테스트', () => {
  test('CreateBodyDto 테스트', async () => {
    const dto = plainToInstance(ClickParamDto, {
      projectId: '1',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
