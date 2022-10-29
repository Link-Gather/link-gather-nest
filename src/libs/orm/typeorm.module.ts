import { DynamicModule, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TYPEORM_CUSTOM_REPOSITORY } from './repository.decorator';

export class TypeOrmModule {
  /**
   * repository 를 import 할 때는 TypeOrmModule.forRepository 를 사용하고 그외에는 TypeOrmModule.forFeature 를 사용한다.
   */
  public static forRepository<T extends new (...args: any[]) => any>(repositories: T[]): DynamicModule {
    const providers: Provider[] = [];

    for (const Repository of repositories) {
      const entity = Reflect.getMetadata(TYPEORM_CUSTOM_REPOSITORY, Repository);

      if (!entity) {
        continue;
      }

      providers.push({
        inject: [getDataSourceToken()],
        provide: Repository,
        useFactory: (dataSource: DataSource): typeof Repository => {
          return new Repository(dataSource.createEntityManager());
        },
      });
    }

    return {
      exports: providers,
      module: TypeOrmModule,
      providers,
    };
  }
}
