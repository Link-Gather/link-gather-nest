import { Store } from 'confidence';
import { ormConfig } from './ormconfig';

const doc = {
  port: { $env: 'PORT' },
  jwtSecret: { $env: 'JWT_SECRET' },
  ormConfig,
};

const store = new Store(doc);

export const getConfig = (key: string) => store.get(key);
