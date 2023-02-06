import { Store } from 'confidence';
import { ormConfig } from './ormconfig';

const doc = {
  port: { $env: 'PORT' },
  jwtSecret: { $env: 'JWT_SECRET' },
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
      clientSecret: { $env: 'KAKAO_CLIENT_SECRET' }, // TODO: 제대로 된 카카오 어플리케이션 키를 만들고 나서 주입하도록 한다.
      redirectUri: { $env: 'KAKAO_REDIRECT_URI' },
    },
  },
  ormConfig,
};

const store = new Store(doc);

export const getConfig = (key: string) => store.get(key);
