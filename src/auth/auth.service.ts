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
      const name = req.user.providerName;

      existsUser = await this.userRepository.findOne({ providerName: name });
      console.log(existsUser);
      if (existsUser) {
        console.log('이미 저장했습니다');
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
        html: `
        <h1>
         velog 인증코드 메일
        </h1>
        <hr />
        <br />
        <p>안녕하세요 ${email}님 <p/>
        <p>인증코드를 회원가입화면에 입력해주세요 : ${number} </p>
        <br />
        <hr />
        <p><a href="http://localhost:3000/register?code=124e54578hjh">회원가입 하러 가기 </a></p>
        <p>이 메일을 요청한 적이 없으시다면 무시하시기 바랍니다.</p>
      `,
      });
      return number;
    } catch (err) {
      console.log(err);
    }
  }
  async sendMail2(email: string) {
    try {
      await this.mailerService.sendMail({
        to: email, // list of receivers
        from: 'dmstj7371@naver.com', // sender address
        subject: 'velog-Login.', // Subject line
        html: `
        <h1>
         velog Login 
        </h1>
        <hr />
        <br />
        <p>안녕하세요 ${email}님 <p/>
        <p> 밑에 링크 누르면 velog 바로 시작할 수 있습니다.  </p>
        <br />
        <hr />
        <p><a href="http://localhost:3000/velog.io">로그인 하러 가기 </a></p>
      
      `,
      });
    } catch (err) {
      console.log(err);
    }
  }
}
