import * as ct from 'class-transformer';
import { NonFunctionProperties } from '../types';

/**
 * @param classType
 * @param plain
 */
export const plainToClass = <T>(classType: new (...args: any[]) => T, plain: NonFunctionProperties<T>) => {
  return ct.plainToClass(classType, plain);
};

export const plainToInstance = <T>(classType: new (...args: any[]) => T, plain: NonFunctionProperties<T>) => {
  return ct.plainToClass(classType, plain);
};

let date: typeof Date;

export function mockDate(value: number | string | Date) {
  const now = new Date(value);

  date = global.Date;
  // @ts-expect-error
  global.Date = class Date extends global.Date {
    constructor(...args: ConstructorParameters<typeof date>) {
      if (args.length) {
        super(...args);
        // eslint-disable-next-line no-constructor-return
        return this;
      }
      // eslint-disable-next-line no-constructor-return
      return now;
    }
  };
}

export function resetDate() {
  global.Date = date;
}
