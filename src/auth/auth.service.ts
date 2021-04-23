import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/entities/user.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { Provider } from './dto/register-user.dto';

import config from '../config';
import { Google } from '../entities/Google.entity';
import { GoogleRepository } from 'src/entities/google.repository';

// 인증코드 6자리 만들때 필요
// const generateRandom = function (min: number, max: number) {
//   const ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
//   return ranNum;
// };

const { SECRET_KEY, CLIENT_HOST, API_HOST } = config;

if (!SECRET_KEY || !CLIENT_HOST || !API_HOST) {
  throw new Error('MISSING_ENVAR');
}

type CustomRequest<T> = Request & T;

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService,
    private readonly googleRepository: GoogleRepository,
  ) {
    this.googleRepository = googleRepository;
    this.userRepository = userRepository;
  }
  async googleLogin(
    req: CustomRequest<{ user: Google }>,
  ): Promise<{ url: string; statusCode?: number }> {
    if (!req.user) {
      throw new Error('Not found user info');
    } else {
      let existsUser = null;
      let googleUser = null;
      const { email } = req.user;
      const API_HOST = config.API_HOST;
      const CLIENT_HOST = config.CLIENT_HOST;

      existsUser = await this.userRepository.findOne({ email: email });

      console.log(existsUser);
      // 이미 등록된 회원이니까 바로 로그인
      if (existsUser) {
        console.log('이미 등록된 회원입니다.');
        return {
          url: `${API_HOST}/auth/login-page?email=${email}`,
        };
      } else {
        // 회원가입 필요함 .
        googleUser = await this.googleRepository.findOne({ email: email });
        if (!googleUser) {
          await this.googleRepository.save(req.user);
        }
        return {
          url: `${CLIENT_HOST}/auth/register-form?email=${email}`,
        };
      }
    }
  }

  async findUserEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    return user;
  }

  async findUserID(displayName: string) {
    const user = await this.userRepository.findOne({
      where: { display_name: displayName },
    });
    return user;
  }

  async sendRegisterMail(email: string) {
    try {
      await this.mailerService.sendMail({
        to: email, // list of receivers
        from: 'dmstj7371@naver.com', // sender address
        subject: '회원가입 요청 메일입니다.', // Subject line
        html: `
        <h1>
         velog 회원가입 요청 메일 
        </h1>
        <hr />
        <br />
        <p>안녕하세요 ${email}님 <p/>
        <br />
        <hr />
        <p><a href="${CLIENT_HOST}/auth/register-form?email=${email}">회원가입 하러 가기 </a></p>
        <p>이 메일을 요청한 적이 없으시다면 무시하시기 바랍니다.</p>
      `,
      });
      return { statusCode: 201, message: '회원가입' };
    } catch (err) {
      console.log(err);
    }
  }

  async sendloginMail(email: string) {
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
        <p><a href="${API_HOST}/auth/login-page?email=${email}">시작하기</a></p>
      
      `,
      });
      return { statusCode: 201, message: '로그인' };
    } catch (err) {
      console.log(err);
    }
  }

  async saveUser(
    provider: Provider,
    email: string,
    username: string,
    displayName: string,
    intro: string,
  ) {
    const Newuser = {
      provider: provider,
      email: email,
      username: username,
      display_name: displayName,
      intro: intro,
    };
    return this.userRepository.save(Newuser);
  }
}
