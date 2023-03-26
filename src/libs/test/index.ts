import * as ct from 'class-transformer';
import { NonFunctionProperties } from '../types';

/**
 * @param classType
 * @param plain
 */
export const plainToClass = <T>(classType: new (...args: any[]) => T, plain: NonFunctionProperties<T>) => {
  return ct.plainToClass(classType, plain);
};
