import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './libs/orm/database.module';
import { PostModule } from './services/posts';

@Module({
  imports: [DatabaseModule.manager(), PostModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
