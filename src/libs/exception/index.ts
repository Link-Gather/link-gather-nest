import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import type { Response } from 'express';

export * from './exceptions';

export type ErrorOption = {
  errorMessage: string;
};

// HACK:
interface Error extends HttpException {
  errorMessage: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line class-methods-use-this
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = error.getStatus();

    console.error(error.stack);

    response.status(status).json({ errorMessage: error.errorMessage });
  }
}
