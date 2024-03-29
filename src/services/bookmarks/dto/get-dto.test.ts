import { validate } from 'class-validator';
import { ListResponseDto } from './get-dto';
import { plainToInstance } from '../../../libs/test';

describe('get dto 테스트', () => {
  test('ListResponseDto 테스트', async () => {
    const dto = plainToInstance(ListResponseDto, {
      id: 1,
      projectId: 'testprojectid1',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
