import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dataSource } from './libs/orm';

async function bootstrap() {
  dataSource.initialize().then(() => console.log('DB Connected 🔥'));

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
