import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

import { LoggerService } from '../logger/logger.service';
import { CorrelationService } from './correlation.service';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  constructor(
    private readonly correlationService: CorrelationService,
    private readonly loggerService: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const correlationId = this.correlationService.getCurrentCorrelationId();
    const startTime = Date.now();

    const logMetadata = {
      success: true,
      correlationId,
      method: request.method,
      url: request.originalUrl,
      ip: request.ip,
      duration: `${Date.now() - startTime}ms`,
      userAgent: request.headers['user-agent'],
      referer: request.headers['referer'],
      origin: request.headers['origin'],
    };

    return next.handle().pipe(
      tap({
        next: (data) => {
          Logger.log(
            `${correlationId} ${request.method} ${request.url}`,
            `Response Time = ${Date.now() - startTime}ms`,
          );
          logMetadata.duration = `${Date.now() - startTime}ms`;
          this.loggerService.info('HTTP Request', {
            metadata: logMetadata,
          });
        },
        error: (error) => {
          Logger.error(
            `${correlationId} ${request.method} ${request.url}`,
            `${error.message} - ${Date.now() - startTime}ms`,
            // error.stack,
          );

          logMetadata.duration = `${Date.now() - startTime}ms`;
          logMetadata.success = false;
          logMetadata['error'] = {
            message: error?.message,
            status: error?.statusCode,
            stack: error?.stack,
          };

          this.loggerService.error('HTTP Error Request', undefined, {
            metadata: logMetadata,
          });
        },
      }),
      map((data) => ({
        // success: true,
        // correlationId,
        // timestamp: new Date().toISOString(),
        ...data,
      })),
      // catchError(error => {
      //   throw new HttpException(
      //     {
      //       // success: false,
      //       // correlationId,
      //       // timestamp: new Date().toISOString(),
      //       error: {
      //         message: error?.message || error?.error || ResponseMessage.INTERNAL_SERVER_ERROR,
      //         // status: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      //       },
      //     },
      //     error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      //   );
      // }),
    );
  }
}
