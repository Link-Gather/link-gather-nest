import { dataSource } from '.';
import { Service } from '../ddd/service';

export function Transactional() {
  return function (target: Service, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (this: Service) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const thiz = this;
      const args = arguments; // eslint-disable-line prefer-rest-params
      const originalEntityManager = this.entityManager;
      let result: any;
      await dataSource.manager.transaction(async (entityManager) => {
        thiz.entityManager = entityManager;
        result = await originalMethod.apply(thiz, args);
      });
      thiz.entityManager = originalEntityManager;
      return result;
    };
    return descriptor;
  };
}
