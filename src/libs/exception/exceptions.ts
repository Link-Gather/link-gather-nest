import { HttpException } from '@nestjs/common';
import type { ErrorOption } from './index';

export function badRequest(message?: string, option?: ErrorOption) {
  message = message || 'Bad Request';
  throw new HttpException({ message, errorMessage: option?.errorMessage }, 400);
}
