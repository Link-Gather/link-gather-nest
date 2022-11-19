import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import type { Response } from 'express';

export * from './exceptions';

export type ErrorOption = {
  errorMessage: string;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line class-methods-use-this
  catch(error: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = error.getStatus();

    console.error(error.stack);

    // @ts-expect-error
    response.status(status).json({ errorMessage: error.getResponse().errorMessage });
  }
}
