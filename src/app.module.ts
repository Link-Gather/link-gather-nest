import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GuardModule } from './libs/auth';
import { GracefulShutdownService } from './libs/graceful-shutdown';
import { DatabaseModule } from './libs/orm/database.module';
import { UserModule, ProjectModule, AuthModule, StackModule } from './services';

@Module({
  imports: [DatabaseModule.manager(), ProjectModule, StackModule, UserModule, AuthModule, GuardModule],
  controllers: [AppController],
  providers: [GracefulShutdownService],
})
export class AppModule {}
