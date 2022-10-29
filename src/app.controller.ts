import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/ping')
  get(): string {
    return 'pong';
  }
}
