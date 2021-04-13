import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('velog.io')
  main() {
    return 'welcome velog ';
  }

  @Get('velog.io/recent')
  resent() {
    return 'welcome recent velog ';
  }
}
