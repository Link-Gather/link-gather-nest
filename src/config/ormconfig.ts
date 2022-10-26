import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import entities from '../entities';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'link_gather',
  entities: [...entities],
  synchronize: true,
  logging: true,
};
