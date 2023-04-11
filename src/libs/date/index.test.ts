import { addHours, addMinutes } from './index';

describe('date lib 테스트', () => {
  describe('addMinutes 테스트', () => {
    test('분을 더할 수 있다.', () => {
      expect(addMinutes(new Date('2023-03-22T00:00:00.000Z'), 1)).toEqual(new Date('2023-03-22T00:01:00.000Z'));
    });
    test('분을 뺄 수 있다.', () => {
      expect(addMinutes(new Date('2023-03-22T00:00:00.000Z'), -1)).toEqual(new Date('2023-03-21T23:59:00.000Z'));
    });
  });
  describe('addHours 테스트', () => {
    test('시간을 더할 수 있다.', () => {
      expect(addHours(new Date('2023-03-22T00:00:00.000Z'), 1)).toEqual(new Date('2023-03-22T01:00:00.000Z'));
    });
    test('시간을 뺄 수 있다.', () => {
      expect(addHours(new Date('2023-03-22T00:00:00.000Z'), -1)).toEqual(new Date('2023-03-21T23:00:00.000Z'));
    });
  });
});
