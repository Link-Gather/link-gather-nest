import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dataSource } from './libs/orm';

const port = process.env.PORT;

async function bootstrap() {
  dataSource.initialize().then(() => console.log('DB Connected 🔥'));

  const app = await NestFactory.create(AppModule);
  await app.listen(Number(port)).then(() => console.log('Server Connected 🙏'));
}
bootstrap();
