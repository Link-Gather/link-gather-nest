import { join } from 'path';

const ormConfig = {
  type: 'mysql',
  host: { $env: 'DB_HOST' },
  port: { $env: 'DB_PORT' },
  database: { $env: 'DB_NAME' },
  username: { $env: 'DB_USER' },
  password: { $env: 'DB_PASSWORD' },
  entities: [join(__dirname, '..', 'services', '**', 'domain', 'model.{ts,js}')],
};

export default {
  $filter: { $env: 'NODE_ENV' },
  production: {
    ...ormConfig,
    synchronize: false,
    logging: true,
    // migrations: ['src/migration/**/*.ts'],
    supportBigNumbers: true,
    bigNumberStrings: false,
  },
  $default: {
    ...ormConfig,
    synchronize: true,
    logging: true,
    // migrations: ['src/migration/**/*.ts'],
    supportBigNumbers: true,
    bigNumberStrings: false,
  },
};
