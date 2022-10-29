import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // eslint-disable-next-line class-methods-use-this
  @Get('/ping')
  get(): string {
    return 'pong';
  }
}
