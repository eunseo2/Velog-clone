import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

const generateRandom = function (min: number, max: number) {
  const ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return ranNum;
};

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail() {
    try {
      const number: number = generateRandom(111111, 999999);
      await this.mailerService.sendMail({
        to: 'dmstj7371@gmail.com', // list of receivers
        from: 'dmstj7371@naver.com', // sender address
        subject: '이메일 인증 요청 메일입니다.', // Subject line
        html: '오른쪽 숫자 6자리를 입력해주세요:' + `<b> ${number}</b>`, // HTML body content
      });
      return number;
    } catch (err) {
      console.log(err);
    }
  }
}
