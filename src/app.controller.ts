import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

import { Token } from './lib/token';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly token: Token,
  ) {}
  @Get('/')
  main() {
    return 'welcome  velog ';
  }

  @Get('/recent')
  resent() {
    return 'welcome recent velog ';
  }
}
