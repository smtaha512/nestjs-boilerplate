import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT!;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(PORT);

  Logger.debug(`Application running at PORT ${PORT}`, 'main');
}
bootstrap();
