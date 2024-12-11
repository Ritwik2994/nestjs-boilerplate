import { Injectable } from '@nestjs/common';
import cls from 'cls-hooked';

import { CorrelationOptions, DEFAULT_CORRELATION_OPTIONS } from './correlation.utils';

@Injectable()
export class CorrelationService {
  private static namespace = cls.createNamespace('correlation-context');
  private options: CorrelationOptions;

  constructor() {
    this.options = { ...DEFAULT_CORRELATION_OPTIONS };
  }

  // Get current correlation ID from context
  getCurrentCorrelationId(): string | null {
    return CorrelationService.namespace.get('correlationId');
  }

  // Run a function within correlation context
  runWithContext<T>(fn: () => T): T {
    return CorrelationService.namespace.run(() => fn());
  }
}
