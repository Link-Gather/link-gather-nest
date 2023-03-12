import { Store } from 'confidence';
import { ormConfig } from './ormconfig';

const doc = {
  port: { $env: 'PORT' },
  origin: { $env: 'ORIGIN' },
  jwtSecret: { $env: 'JWT_SECRET' },
  saltRounds: { $env: 'SALT_ROUNDS' },
  oauth: {
    github: {
      clientId: { $env: 'GITHUB_CLIENT_ID' },
      clientSecret: { $env: 'GITHUB_CLIENT_SECRET' },
    },
    google: {
      clientId: { $env: 'GOOGLE_CLIENT_ID' },
      clientSecret: { $env: 'GOOGLE_CLIENT_SECRET' },
      redirectUri: { $env: 'GOOGLE_REDIRECT_URI' },
    },
    kakao: {
      clientId: { $env: 'KAKAO_CLIENT_ID' },
      clientSecret: { $env: 'KAKAO_CLIENT_SECRET' },
      redirectUri: { $env: 'KAKAO_REDIRECT_URI' },
    },
  },
  ormConfig,
};

const store = new Store(doc);

export const getConfig = (key: string) => store.get(key);
