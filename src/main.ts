import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { getConfig } from './config';
import { HttpExceptionFilter } from './libs/exception';
import { GracefulShutdownService } from './libs/graceful-shutdown';
import { dataSource } from './libs/orm';
import { setupSwagger } from './libs/swagger';

const PORT = getConfig('/port');
const CORS_ORIGIN = getConfig('/corsOrigin');
const COOKIE_SIGN = getConfig('/cookie/sign');

async function bootstrap() {
  dataSource.initialize().then(() => console.log('DB Connected 🔥'));

  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin: CORS_ORIGIN });
  app.use(cookieParser(COOKIE_SIGN));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  setupSwagger(app);
  app.get(GracefulShutdownService);
  app.enableShutdownHooks(['SIGINT', 'SIGTERM']);

  await app.listen(Number(PORT)).then(() => console.log('Server Connected 🙏'));
}
bootstrap();
