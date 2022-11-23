import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { dataSource } from '../orm';

@Injectable()
export class GracefulShutdownService implements OnApplicationShutdown {
  // eslint-disable-next-line class-methods-use-this
  async onApplicationShutdown(signal?: string | undefined) {
    console.log('The server shuts down when the connection is cleaned up.');

    try {
      await dataSource.destroy();
    } catch (err) {
      console.error(err);
    } finally {
      console.log('bye 👋');
      process.exit();
    }
  }
}
