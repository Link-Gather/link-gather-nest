import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line class-methods-use-this
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    console.error(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
