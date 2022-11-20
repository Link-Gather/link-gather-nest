import { HttpException } from '@nestjs/common';
import type { ErrorOption } from './index';

export const badRequest = (message?: string, option?: ErrorOption) => {
  message = message || 'Bad Request';
  throw new HttpException({ message, errorMessage: option?.errorMessage }, 400);
};

export const forbidden = (message?: string, option?: ErrorOption) => {
  message = message || 'Forbidden';
  throw new HttpException({ message, errorMessage: option?.errorMessage }, 403);
};

export const unauthorized = (message?: string, option?: ErrorOption) => {
  message = message || 'Unauthorized';
  throw new HttpException({ message, errorMessage: option?.errorMessage }, 401);
};

export const notImplemented = (message?: string, option?: ErrorOption) => {
  message = message || 'Not Implemented';
  throw new HttpException({ message, errorMessage: option?.errorMessage }, 501);
};
