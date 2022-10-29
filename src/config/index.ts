import { Store } from 'confidence';
import { ormConfig } from './ormconfig';

const doc = {
  ormConfig,
};

const store = new Store(doc);

export const getConfig = (key: string) => store.get(key);
