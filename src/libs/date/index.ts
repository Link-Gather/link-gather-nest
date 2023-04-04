import * as dayjs from 'dayjs';

export function addMinutes(date: Date, minutes: number) {
  return dayjs(date).add(minutes, 'minutes').toDate();
}

export function addHours(date: Date, hours: number) {
  return dayjs(date).add(hours, 'hours').toDate();
}
