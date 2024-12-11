import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class ResponseTimeMiddleware implements NestMiddleware {
  private readonly digits: number = 4;
  private readonly header: string = 'X-Response-Time';
  private readonly suffix: boolean = true;

  constructor() {}

  use(req: any, res: any, next: NextFunction): void {
    const startAt = process.hrtime();

    // Override res.end to calculate and set response time header
    const originalEnd = res.end;
    res.end = (...args: any[]): void => {
      const diff = process.hrtime(startAt);
      const time = diff[0] * 1e3 + diff[1] * 1e-6;

      if (!res.getHeader(this.header)) {
        let val = time.toFixed(this.digits);
        if (this.suffix) {
          val += 'ms';
        }
        res.setHeader(this.header, val);
      }

      originalEnd.call(res, ...args);
    };

    next();
  }
}
