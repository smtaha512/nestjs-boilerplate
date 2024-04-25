import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export class ApiDocsConfig {
  static setupApiDocs(app: INestApplication): INestApplication {
    const options = ApiDocsConfig.buildDocument();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/api-docs', app, document);

    return app;
  }

  private static buildDocument(): Omit<OpenAPIObject, 'paths'> {
    return new DocumentBuilder()
      .setTitle('NestJS Boilerplate API Docs')
      .setDescription('REST API Documentation for NestJS Boilerplate')
      .setVersion('1.0')
      .addBearerAuth({
        name: 'Authorization',
        description: 'Please enter token without Bearer keyword',
        type: 'http',
      })
      .build();
  }
}
