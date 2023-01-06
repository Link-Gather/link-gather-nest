import { join } from 'path';

export const ormConfig = {
  type: 'mysql',
  host: { $env: 'DB_HOST' },
  port: { $env: 'DB_PORT' },
  database: { $env: 'DB_NAME' },
  username: { $env: 'DB_USER' },
  password: { $env: 'DB_PASSWORD' },
  entities: [join(__dirname, '..', 'services', '**', 'domain', 'model.{ts,js}')],
  synchronize: true,
  logging: true,
};
