import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerMiddleware(app: INestApplication) {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .addOAuth2()
    .setTitle('Fitu 1.0 APIs')
    .setDescription('Fitu backend api documentation')
    .setVersion('1.0')
    .addTag('Fitu')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'Fitu',
    },
  });
}
