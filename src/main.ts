import { HttpStatus, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import xssClean from 'xss-clean';

import { AppModule } from './app.module';
import { getEnvVariable } from './shared/config/config';
import { NodeEnv } from './shared/enum/common.enum';
import { swaggerMiddleware } from './shared/swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bodyParser: true,
    logger: ['error', 'fatal', 'log', 'verbose', 'warn', 'debug'],
  });

  const envApp = getEnvVariable('NODE_ENV');
  const port = getEnvVariable('PORT') || 3000;
  const isExcludedEnv: boolean = ['dev', 'qa', 'uat'].includes(envApp);
  app.setGlobalPrefix('/api');

  /**
   * helmet middleware to set various security headers in a production environment.
   * It also sets a content security policy with custom directives to control which resources are allowed to be loaded.
   * Helmet will not work with playground, so if the env = production then playground should get disabled
   */
  if (envApp === NodeEnv.Production) {
    app.use(
      helmet({
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            defaultSrc: ["'self'", 'https://polyfill.io', 'https://*.cloudflare.com'],
            scriptSrc: ["'self'", 'https://polyfill.io', 'https://*.cloudflare.com'],
            styleSrc: ["'self'", 'https:'],
            imgSrc: ["'self'", 'data:', 'blob:'],
            fontSrc: ["'self'", 'https:', 'data:'],
            childSrc: ["'self'", 'blob:'],
            frameSrc: ["'self'"],
            frameAncestors: ["'none'"],
          },
        },
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: true,
        crossOriginResourcePolicy: true,
        dnsPrefetchControl: true,
        // hsts: true,
        hidePoweredBy: true,
        ieNoOpen: true,
        noSniff: true,
        originAgentCluster: true,
        permittedCrossDomainPolicies: {
          permittedPolicies: 'by-content-type',
        },
        referrerPolicy: {
          policy: 'same-origin',
        },
        xssFilter: true,
        // xFrameOptions: { action: 'deny' },
        frameguard: { action: 'deny' },
        hsts: {
          maxAge: 31_536_000, // 1 year in seconds
          includeSubDomains: true,
          preload: true,
        },
      }),
    );
  }

  app.set('trust proxy', true);
  app.use(compression()); // Compression Settings
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.getHttpAdapter().getInstance().disable('Server');
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.PRECONDITION_FAILED,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  app.use(cookieParser());
  app.use(compression());
  app.use(json({ limit: '50kb' }));
  app.use(urlencoded({ extended: true, limit: '50kb' }));
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  const ignoreMethods = isExcludedEnv
    ? ['GET', 'HEAD', 'OPTIONS', 'DELETE', 'POST', 'PATCH', 'PUT'] // for development we ignoring all
    : ['GET', 'HEAD', 'OPTIONS', 'DELETE'];
  app.use(
    csurf({
      cookie: { httpOnly: true, secure: true },
      ignoreMethods,
    }),
  );

  app.use(xssClean()); // XSS Filter
  app.use(hpp()); // Prevent http Parameter pollution

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  // swagger middleware
  if (envApp !== NodeEnv.Production) {
    swaggerMiddleware(app);
  }

  app.listen(port, () => {
    Logger.log(`${envApp} Http Server is running on ${port}`, `Application Server`);
    Logger.log(`http://localhost:${port}/docs`, `Swagger API Docs`);
  });
}
bootstrap();
