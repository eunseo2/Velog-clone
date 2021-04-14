import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly maileService: MailService) {}

  @Get()
  async sendMail() {
    const result = await this.maileService.sendMail();
    console.log(result);

    return result;
  }
}
