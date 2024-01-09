import { dataSource } from './config';

// HACK: 일단 이렇게라도 해서 entityManager를 통일시켜서 트랜젝션을 건다.
export function Transactional() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (this: any) {
      const args = arguments; // eslint-disable-line prefer-rest-params
      let originalEntityManager;
      let result: any;
      await dataSource.manager.transaction(async (entityManager) => {
        for (const key of Object.keys(this)) {
          const repository = this[key];
          if (repository.entityManager) {
            originalEntityManager = repository.entityManager;
            repository.entityManager = entityManager;
          }
        }
        result = await originalMethod.apply(this, args);
      });
      for (const key of Object.keys(this)) {
        const repository = this[key];
        if (repository.entityManager) {
          repository.entityManager = originalEntityManager;
        }
      }
      return result;
    };
    return descriptor;
  };
}
