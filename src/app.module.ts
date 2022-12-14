import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GracefulShutdownService } from './libs/graceful-shutdown';
import { DatabaseModule } from './libs/orm/database.module';
import { UserModule, ProjectModule } from './services';

@Module({
  imports: [DatabaseModule.manager(), ProjectModule, UserModule],
  controllers: [AppController],
  providers: [GracefulShutdownService],
})
export class AppModule {}
