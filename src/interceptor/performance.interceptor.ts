import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const end = Date.now();
        const duration = end - start;

        if (duration > 100) {
          // Log if operation takes more than 1 second
          const handler = context.getHandler();
          const className = context.getClass().name;

          this.logger.warn(`
            Slow Operation Detected:
            Class: ${className}, 
            Method: ${handler.name}, 
            Duration: ${duration}ms
          `);
        }
      }),
    );
  }
}
