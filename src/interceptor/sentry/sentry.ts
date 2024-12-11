import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { catchError, Observable } from 'rxjs';
import { getEnvVariable } from '@app/shared/config/config';
import { NodeEnv } from '@app/shared/enum/common.enum';

export function initializeSentry() {
  Sentry.init({
    enabled: getEnvVariable('NODE_ENV') === 'prod',
    dsn: getEnvVariable('SENTRY_DSN'),
    tracesSampleRate: 1,
    environment: NodeEnv.Production,
  });
}

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const methodName = context.getHandler().name;

    const requestData = {
      method: request.method,
      url: request.url,
      body: JSON.stringify(request.body),
    };

    return next.handle().pipe(
      catchError((error) => {
        this.captureError(methodName, startTime, requestData, error);
        throw error;
      }),
    );
  }

  private captureError(methodName: string, startTime: number, requestData: any, error: Error) {
    const duration = Date.now() - startTime;

    Sentry.captureException(error, {
      level: 'error',
      extra: {
        duration,
        request: requestData,
        message: `Error in ${methodName}`,
      },
    });
  }
}
