import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseDatabaseModule } from './db/mongoose.module';
import { HealthModule } from './health/health.module';
import { HelperModule } from './helper/helper.module';
import { CorsMiddleware } from './middleware/cors/cors.middleware';
import { UserAgentMiddleware } from './middleware/user-agent/user-agent.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { LoggingInterceptor } from './shared/core/logging-interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // validationSchema: envSchema,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: +config.get<string>('THROTTLE_TTL'),
          limit: +config.get<string>('THROTTLE_LIMIT'),
        },
      ],
    }),
    MongooseDatabaseModule,
    HealthModule,
    AuthModule,
    HelperModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAgentMiddleware).forRoutes('*');
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
