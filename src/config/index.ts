import { ormConfig } from './ormconfig';
import { Store } from 'confidence';

const doc = {
  ormConfig,
};

const store = new Store(doc);

export const getConfig = (key: string) => store.get(key);
