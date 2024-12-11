import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Connection } from 'mongoose';
// import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly mongoose: MongooseHealthIndicator,

    @InjectConnection() private readonly mongoConnection: Connection,
    // @InjectRedis() private readonly redis: Redis
  ) {}

  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.http.pingCheck('https', 'https://google.com'),
      () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.75 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      () => this.mongoose.pingCheck('mongodb'),
      () => this.checkRedis('redis'),

      () => this.checkMongoConnection('mongo_connection'),
    ]);
  }

  private async checkRedis(key: string): Promise<HealthIndicatorResult> {
    try {
      //   await this.redis.ping();
      return {
        [key]: {
          status: 'up',
        },
      };
    } catch (error) {
      return {
        [key]: {
          status: 'down',
          message: error.message,
        },
      };
    }
  }

  private async checkMongoConnection(key: string): Promise<HealthIndicatorResult> {
    try {
      return this.mongoConnection.readyState === 1
        ? {
            [key]: {
              status: 'up',
            },
          }
        : {
            [key]: {
              status: 'down',
              message: 'MongoDB connection is not ready',
            },
          };
    } catch (error) {
      return {
        [key]: {
          status: 'down',
          message: error.message,
        },
      };
    }
  }
}
