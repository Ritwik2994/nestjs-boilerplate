import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /**
   * @description Intercepts the execution context and calls the next handler.
   * @param {ExecutionContext} context - The execution context.
   * @param {CallHandler} next - The next handler to call.
   * @return {Observable<any>} - An observable that emits the response.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const url = context.switchToHttp().getRequest().originalUrl;
    const now = Date.now();
    return next.handle().pipe(tap(() => Logger.log(url, `Response Time = ${Date.now() - now}ms`)));
  }
}
