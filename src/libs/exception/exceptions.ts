import { HttpException } from '@nestjs/common';
import type { ErrorOption } from './index';

export class BadRequest extends HttpException {
  errorMessage!: string;

  // eslint-disable-next-line default-param-last
  constructor(message = 'Bad Request', option?: ErrorOption) {
    super(message, 400);
    this.errorMessage = option?.errorMessage || message;
  }
}
