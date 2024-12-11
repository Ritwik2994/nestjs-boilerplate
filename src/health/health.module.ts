import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseModule } from 'src/db/database.module';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [
    TerminusModule.forRoot({ errorLogStyle: 'pretty', logger: true }),
    HttpModule,
    DatabaseModule,
    // TerminusModule.forRoot({ errorLogStyle: 'pretty', logger: true }),
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
