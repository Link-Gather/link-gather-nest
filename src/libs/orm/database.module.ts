import { DynamicModule } from '@nestjs/common';
import { dataSource } from '.';

export class DatabaseModule {
  static manager(): DynamicModule {
    const providers = [
      {
        provide: 'entityManager',
        useValue: dataSource.createEntityManager(),
      },
    ];
    return {
      exports: providers,
      module: DatabaseModule,
      providers,
    };
  }
}
