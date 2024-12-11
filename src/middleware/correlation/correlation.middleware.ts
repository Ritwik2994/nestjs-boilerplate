import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import cls from 'cls-hooked';

import { CorrelationOptions } from './correlation.utils';

@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  constructor(@Inject('CORRELATION_OPTIONS') private readonly options: CorrelationOptions) {}

  use(req: any, res: any, next: () => void) {
    const namespace = cls.getNamespace('correlation-context');

    namespace.bind(req);
    namespace.bind(res);

    namespace.run(() => {
      // Get or generate correlation ID
      let correlationId = req.headers[this.options.header];

      // Validate or generate new ID
      if (!correlationId || !this.options.validateId(correlationId)) {
        correlationId = this.options.generateId();
      }

      // Set in namespace and headers
      namespace.set('correlationId', correlationId);
      req.correlationId = correlationId;
      res.set(this.options.header, correlationId);

      next();
    });
  }
}
