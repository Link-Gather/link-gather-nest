import { DynamicModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../services/users/infrastructure/repository';
import { AuthGuard } from './guard';

export class GuardModule {
  static auth(): DynamicModule {
    const providers = [
      {
        provide: 'AUTH_GUARD',
        useClass: AuthGuard,
      },
      JwtService,
      UserRepository,
    ];
    return {
      global: true,
      exports: providers,
      module: GuardModule,
      providers,
    };
  }
}
