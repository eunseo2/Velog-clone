import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly maileService: MailService) {}

  @Get()
  sendMail(): any {
    return this.maileService.sendMail();
  }
}
