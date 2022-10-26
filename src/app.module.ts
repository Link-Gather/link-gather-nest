import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getConfig } from './config';
import { PostModule } from './services/posts';

const ormConfig = getConfig('/ormConfig');

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
