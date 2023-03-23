import { addDays } from './index';

describe('date lib 테스트', () => {
  describe('addDays 테스트', () => {
    test('날짜를 더할 수 있다.', () => {
      expect(addDays(new Date('2023-03-22T00:00:00.000Z'), 1)).toEqual(new Date('2023-03-23T00:00:00.000Z'));
    });
    test('날짜를 뺄 수 있다.', () => {
      expect(addDays(new Date('2023-03-22T00:00:00.000Z'), -1)).toEqual(new Date('2023-03-21T00:00:00.000Z'));
    });
  });
});
