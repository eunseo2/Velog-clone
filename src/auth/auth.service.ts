import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/entities/user.repository';
import { MailerService } from '@nestjs-modules/mailer';

const generateRandom = function (min: number, max: number) {
  const ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return ranNum;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService,
  ) {
    this.userRepository = userRepository;
  }
  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    } else {
      let existsUser = null;
      const name = req.user.name;
      existsUser = await this.userRepository.findOne({ name: name });
      console.log(existsUser);
      if (existsUser) {
        console.log('이미 저장했습니다');
        return req.user;
      } else {
        return await this.userRepository.save(req.user);
      }
    }
  }

  async login(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    return user;
  }

  async sendMail(email: string) {
    try {
      const number: number = generateRandom(111111, 999999);
      await this.mailerService.sendMail({
        to: email, // list of receivers
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
