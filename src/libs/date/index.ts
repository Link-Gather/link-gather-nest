import * as dayjs from 'dayjs';

export function addMinutes(date: Date, minutes: number) {
  return dayjs(date).add(minutes, 'minutes').toDate();
}
