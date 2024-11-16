import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiDocsConfig } from './infra/config/api-docs.config';
import { EnvConfig, EnvConfigInjectionKey } from './infra/config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { port } = app.get<EnvConfig>(EnvConfigInjectionKey);

  ApiDocsConfig.setupApiDocs(app);

  await app.listen(port);

  Logger.debug(`Application running at PORT ${port}`, 'main');
}
bootstrap();
