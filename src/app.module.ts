import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GracefulShutdownService } from './libs/graceful-shutdown';
import { DatabaseModule } from './libs/orm/database.module';
import { UserModule, PostModule } from './services';

@Module({
  imports: [DatabaseModule.manager(), PostModule, UserModule],
  controllers: [AppController],
  providers: [GracefulShutdownService],
})
export class AppModule {}
