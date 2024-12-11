import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './db/database.module';
import { HealthModule } from './health/health.module';
import { HelperModule } from './helper/helper.module';
import { CorrelationIdInterceptor } from './middleware/correlation/correlation.interceptor';
import { CorrelationMiddleware } from './middleware/correlation/correlation.middleware';
import { CorrelationIdModule } from './middleware/correlation/correlation.module';
import { CorrelationService } from './middleware/correlation/correlation.service';
import { CorsMiddleware } from './middleware/cors/cors.middleware';
import { LoggerService } from './middleware/logger/logger.service';
import { ResponseTimeMiddleware } from './middleware/response-time/response-time.middleware';
import { UserAgentMiddleware } from './middleware/user-agent/user-agent.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { NotificationModule } from './modules/notification/notification.module';
import { UserModule } from './modules/user/user.module';
import { config, getEnvVariable } from './shared/config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: Number(getEnvVariable('THROTTLE_TTL')),
          limit: Number(getEnvVariable('THROTTLE_LIMIT')),
        },
      ],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_AUTH_KEY'),
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: false,
        },
        limiter: {
          max: 100,
          duration: 10_000,
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    HelperModule,
    NotificationModule,
    UserModule,
    CorrelationIdModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CorrelationService,
    LoggerService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CorrelationIdInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware, CorrelationMiddleware, UserAgentMiddleware, ResponseTimeMiddleware)
      .forRoutes('*');
  }
}
