import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: null,
    };

    // Handle BadRequestException (for validation errors)
    if (exception instanceof BadRequestException) {
      const validationErrors = exception.getResponse();

      // If the response is an object (usually for validation errors)
      if (typeof validationErrors === 'object' && validationErrors['message']) {
        errorResponse.message = validationErrors['message'];
      }

      // If the response is an array of validation errors
      if (Array.isArray(validationErrors)) {
        errorResponse.message = validationErrors
          .map((err) => Object.values(err.constraints || {}).join(', '))
          .join(', ');
      }
    } else {
      // For other exceptions, use the default message
      errorResponse.message = exception.message || 'Internal server error';
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
        'ExceptionFilter',
      );
    } else {
      this.logger.error(
        `${request.method} ${request.url}`,
        JSON.stringify(errorResponse),
        'ExceptionFilter',
      );
    }

    response.status(status).json(errorResponse);
  }
}
