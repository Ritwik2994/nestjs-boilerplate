import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { CorrelationService } from '../correlation/correlation.service';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly correlationService: CorrelationService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const correlationId = this.correlationService.getCurrentCorrelationId();
      const duration = Date.now() - startTime;
      const { method, originalUrl, ip, headers } = req;
      const { statusCode } = res;

      // Prepare common metadata
      const logMetadata = {
        correlationId,
        method,
        url: originalUrl,
        status: statusCode,
        ip,
        duration: `${duration}ms`,
        userAgent: headers['user-agent'],
        referer: headers['referer'],
      };

      // Conditionally log based on status code
      if (statusCode >= 200 && statusCode < 300) {
        // Successful responses
        this.loggerService.info('HTTP Request', {
          metadata: logMetadata,
        });
      } else if (statusCode >= 400 && statusCode < 600) {
        // Error responses (4xx and 5xx)
        this.loggerService.error('HTTP Error Request', undefined, {
          metadata: logMetadata,
        });
      }
    });

    next();
  }
}
