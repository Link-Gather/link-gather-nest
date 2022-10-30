import { DynamicModule, Scope } from '@nestjs/common';
import { dataSource } from '.';

export class DatabaseModule {
  static manager(): DynamicModule {
    const providers = [
      {
        provide: 'entityManager',
        useValue: dataSource.createEntityManager(),
        scope: Scope.REQUEST,
      },
    ];
    return {
      global: true,
      exports: providers,
      module: DatabaseModule,
      providers,
    };
  }
}
