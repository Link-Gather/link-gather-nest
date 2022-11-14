import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConfig } from './config';
import { dataSource } from './libs/orm';

const port = getConfig('/port');

async function bootstrap() {
  dataSource.initialize().then(() => console.log('DB Connected 🔥'));

  const app = await NestFactory.create(AppModule);
  await app.listen(Number(port)).then(() => console.log('Server Connected 🙏'));
}
bootstrap();
