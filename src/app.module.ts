import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from './config';
import { UserModule } from './modules/user.module';

const ormConfig = getConfig('/ormConfig');

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
