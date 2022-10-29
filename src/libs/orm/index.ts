import { FindOperator } from 'typeorm';
import * as _ from 'lodash';

export * from './repository.decorator';
export * from './typeorm.module';

/**
 * Array는 or 조건
 * Object는 and 조건을 표현한것이다.
 */
type Condition<T> = {
  [P in keyof T]?: Condition<T>[] | FindOperator<T | string | number> | string | number;
};

export class Specification<T> {
  where: Condition<T> | Condition<T>[] = {};

  get isEmpty(): boolean {
    if (_.isArray(this.where)) {
      return this.where.length === 0;
    }
    return Object.keys(this.where).length === 0;
  }

  // merge
  constructor(spec?: Specification<T> | Condition<T> | (Specification<T> | Condition<T>)[]) {
    if (spec) {
      this.where = _.isArray(spec) ? spec.map(Specification.specToCondition) : Specification.specToCondition(spec);
    }
  }

  static specToCondition<T>(spec: Specification<T> | Condition<T>) {
    if (spec instanceof Specification) {
      if (spec.isEmpty) {
        return {};
      }
      return spec.where;
    }
    return spec;
  }

  and(spec: Specification<T>): Specification<T> {
    if (spec.isEmpty) {
      return this;
    }
    // TODO: 개 거지같은 병합. 여러 라이브러리들이 원하는 형태로 머지하지 않아서 일단 대충 조건 맞춰서 함
    const src = { ...this.where };
    Object.keys(spec.where).forEach((key) => {
      if ((src as any)[key]) {
        // src가 이미 여러 조건을 담았을때
        if (_.isArray((src as any)[key])) {
          // dst도 여러 대상이면 그냥 합침
          if (_.isArray((spec.where as any)[key])) {
            (src as any)[key] = [...(src as any)[key], ...(spec.where as any)[key]];
          } else {
            (src as any)[key] = [...(src as any)[key], (spec.where as any)[key]];
          }
        } else if (_.isArray((spec.where as any)[key])) {
          // dst가 여러 조건을 담았을때
          (src as any)[key] = [(src as any)[key], ...(spec.where as any)[key]];
        } else {
          // 양쪽 다 배열이 아닌 경우
          (src as any)[key] = [(src as any)[key], (spec.where as any)[key]];
        }
      } else {
        // 이미 존재하는게 없으니 그냥 그대로 넣어줌
        (src as any)[key] = (spec.where as any)[key];
      }
    });
    this.where = src;
    return this;
  }

  or(spec: Specification<T>): Specification<T> {
    if (spec.isEmpty) {
      return this;
    }
    if (_.isArray(this.where)) {
      this.where = [...this.where];
    } else {
      this.where = [this.where];
    }

    if (_.isArray(spec.where)) {
      this.where.push(...spec.where);
    } else {
      this.where.push(spec.where);
    }
    return this;
  }
}

export class DuplicateEntryError extends Error {
  constructor(public driver: string) {
    super(driver);
    this.name = 'DuplicateEntryError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DuplicateEntityError extends Error {
  constructor() {
    super();
    this.name = 'DuplicateEntityError';
    this.message = 'DuplicateEntityError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export interface FindOrder {
  order: {
    [prop: string]: 'DESC' | 'ASC';
  };
}

export type PaginationOption = {
  page?: number;
  limit?: number;
};

/**
 * @param options
 */
export const convertOptions = (options?: PaginationOption) => {
  let skip;
  let take;
  if (options && options.page) {
    skip = ((options.page || 1) - 1) * (options.limit || 1);
  }
  if (options && options.limit) {
    take = options.limit;
  }
  return {
    skip,
    take,
  };
};
