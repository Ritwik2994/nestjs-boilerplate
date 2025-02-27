import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerMiddleware(app: INestApplication) {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .addOAuth2()
    .setTitle('BuildDesign 1.0 APIs')
    .setDescription('BuildDesign backend api documentation')
    .setVersion('1.0')
    .addTag('BuildDesign')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'BuildDesign',
    },
  });
}
