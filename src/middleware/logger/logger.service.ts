import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { getEnvVariable } from '@app/shared/config/config';

import { LogContext } from './logger.interface';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: getEnvVariable('LOG_LEVEL') || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [
        // Console transport with colorized output
        // new winston.transports.Console({
        //   format: winston.format.combine(
        //     winston.format.colorize({ all: true }),
        //     nestWinstonModuleUtilities.format.nestLike('Enterprise', {
        //       prettyPrint: true,
        //     }),
        //   ),
        // }),
        // Error log file - only error and above
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxSize: '20m',
          maxFiles: '14d',
        }),
        // Combined log file - all levels
        new DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  /**
   * Log an info message
   * @param message Log message
   * @param context Optional logging context
   */
  info(message: any, context?: LogContext) {
    this.logger.info(message, this.formatContext(context));
  }

  /**
   * Log an error message
   * @param message Error message or Error object
   * @param trace Optional stack trace
   * @param context Optional logging context
   */
  error(message: any, trace?: string, context?: LogContext) {
    this.logger.error(message, {
      trace,
      ...this.formatContext(context),
    });
  }

  /**
   * Log a warning message
   * @param message Warning message
   * @param context Optional logging context
   */
  warn(message: any, context?: LogContext) {
    this.logger.warn(message, this.formatContext(context));
  }

  /**
   * Log a debug message
   * @param message Debug message
   * @param context Optional logging context
   */
  debug(message: any, context?: LogContext) {
    this.logger.debug(message, this.formatContext(context));
  }

  /**
   * Log a verbose message
   * @param message Verbose message
   * @param context Optional logging context
   */
  verbose(message: any, context?: LogContext) {
    this.logger.verbose(message, this.formatContext(context));
  }

  /**
   * Format context for consistent logging
   * @param context Logging context
   * @returns Formatted context object
   */
  private formatContext(context?: LogContext): Record<string, any> {
    if (!context) return {};

    return {
      userId: context.userId,
      requestId: context.requestId,
      service: context.service,
      ...context.metadata,
    };
  }
}
