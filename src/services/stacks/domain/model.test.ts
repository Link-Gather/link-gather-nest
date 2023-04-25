import { Stack } from './model';

describe('Stack 테스트', () => {
  test('Stack 생성 테스트', () => {
    const stack = new Stack({
      name: 'node.js',
      length: 2,
    });

    expect(stack).toEqual({
      name: 'node.js',
      length: 2,
    });
  });
});
