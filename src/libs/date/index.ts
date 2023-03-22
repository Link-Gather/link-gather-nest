import * as dayjs from 'dayjs';

export function addDays(date: Date, day: number) {
  return dayjs(date).add(day, 'day').toDate();
}
