import { Module } from '@nestjs/common';

import { CorrelationMiddleware } from './correlation.middleware';
import { CorrelationService } from './correlation.service';
import { DEFAULT_CORRELATION_OPTIONS } from './correlation.utils';

@Module({
  providers: [
    {
      provide: 'CORRELATION_OPTIONS',
      useValue: DEFAULT_CORRELATION_OPTIONS,
    },
    CorrelationService,
    CorrelationMiddleware,
  ],
  exports: ['CORRELATION_OPTIONS', CorrelationService, CorrelationMiddleware],
})
export class CorrelationIdModule {}
