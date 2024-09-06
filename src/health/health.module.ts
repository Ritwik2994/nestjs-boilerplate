import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { MongooseDatabaseModule } from 'src/db/mongoose.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [
    TerminusModule.forRoot({ errorLogStyle: 'pretty', logger: true }),
    HttpModule,
    MongooseDatabaseModule,
    // TerminusModule.forRoot({ errorLogStyle: 'pretty', logger: true }),
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
