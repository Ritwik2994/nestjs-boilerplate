import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GlobalResponse } from '../../shared/interface/common.interface';

@Injectable()
export class ResponseHandlerService {
  async response(error: any, statusCode?: number, data: any = null): Promise<GlobalResponse> {
    const response: any = {};

    if (error) {
      let parsedError: any;
      try {
        parsedError = typeof error === 'string' ? JSON.parse(error) : error;
      } catch (e) {
        parsedError = {
          error: error.message || error,
          statusCode: statusCode ?? error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
      const finalStatusCode = statusCode ?? parsedError.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;

      Object.assign(response, {
        success: false,
        error: parsedError.error,
        stack: parsedError.stack,
        statusCode: finalStatusCode,
        message: parsedError.error,
      });

      throw new HttpException(response, finalStatusCode);
    }

    Object.assign(response, {
      success: true,
      data,
    });

    return response;
  }
}
