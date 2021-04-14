import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public sendMail(): void {
    this.mailerService
      .sendMail({
        to: 'dmstj7371@gmail.com', // list of receivers
        from: 'dmstj7371@naver.com', // sender address
        subject: '이메일 인증 요청 메일입니다.', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
