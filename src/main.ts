import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConfig } from './config';
import { HttpExceptionFilter } from './libs/exception';
import { dataSource } from './libs/orm';

const port = getConfig('/port');

async function bootstrap() {
  dataSource.initialize().then(() => console.log('DB Connected 🔥'));

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(Number(port)).then(() => console.log('Server Connected 🙏'));
}
bootstrap();
