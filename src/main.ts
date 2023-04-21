import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { isProd } from 'libs/common';
import { AppModule } from './app.module';
import { getConfig } from './config';
import { HttpExceptionFilter } from './libs/exception';
import { GracefulShutdownService } from './libs/graceful-shutdown';
import { dataSource } from './libs/orm';
import { setupSwagger } from './libs/swagger';

const PORT = getConfig('/port');
const CORS_ORIGIN = getConfig('/corsOrigin');
const COOKIE_SIGN = getConfig('/cookie/sign');

// HACK: origin url 이 배열이지만 문자열로 넘어오기 때문에 파싱해줘야 한다.
const origin = isProd ? CORS_ORIGIN.replace(/\\/g, '').slice(1, -1).split(',') : CORS_ORIGIN;

async function bootstrap() {
  dataSource.initialize().then(() => console.log('DB Connected 🔥'));

  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin });
  app.use(cookieParser(COOKIE_SIGN));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  setupSwagger(app);
  app.get(GracefulShutdownService);
  app.enableShutdownHooks(['SIGINT', 'SIGTERM']);

  await app.listen(Number(PORT)).then(() => console.log('Server Connected 🙏'));
}
bootstrap();
