import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/entities/user.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterDto } from './dto/register-user.dto';
import * as jwt from 'jsonwebtoken';
import config from '../config';
//import { User } from 'src/entities/user.entity';
import { Google } from '../entities/Google.entity';
import { GoogleRepository } from 'src/entities/google.repository';

const generateRandom = function (min: number, max: number) {
  const ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return ranNum;
};

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
  async googleLogin(req: CustomRequest<{ user: Google }>) {
    if (!req.user) {
      return 'No user from google';
    } else {
      let existsUser = null;
      let googleUser = null;
      const email = req.user.email;

      existsUser = await this.userRepository.findOne({ email: email });

      console.log(existsUser);
      // 이미 등록된 회원
      if (existsUser) {
        console.log('이미 등록된 회원입니다.');
        return {
          url: 'http://localhost:3000/velog.io',
          statuscode: 200,
        }; // 회원가입 필요함 .
      } else {
        googleUser = await this.googleRepository.findOne({ email: email });
        if (!googleUser) {
          await this.googleRepository.save(req.user);
        }
        return {
          statuscode: 200,
          email: email,
        }; // 회원가입 필요함 .
      }
    }
  }

  async findUserEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    return user;
  }

  async findUserName(username: string) {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    return user;
  }

  async sendcodeMail(email: string) {
    try {
      const code: number = generateRandom(111111, 999999);
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
        <p>인증코드를 회원가입화면에 입력해주세요 : ${code} </p>
        <br />
        <hr />
        <p><a href="http://localhost:3000/register-form">회원가입 하러 가기 </a></p>
        <p>이 메일을 요청한 적이 없으시다면 무시하시기 바랍니다.</p>
      `,
      });
      const result = {
        code,
        email,
      };
      return result;
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
        <p><a href="http://localhost:3000/velog.io?email=${email}">시작하기</a></p>
      
      `,
      });
      return { statusCode: 200 };
    } catch (err) {
      console.log(err);
    }
  }

  async saveUser(
    provider: string,
    email: string,
    username: string,
    userID: string,
    intro: string,
  ) {
    const Newuser: RegisterDto = {
      provider: provider,
      email: email,
      username: username,
      userID: userID,
      Intro: intro,
    };
    return this.userRepository.save(Newuser);
  }

  generateToken = (payload, options): Promise<string> => {
    console.log('payload', payload, options);
    const jwtOptions = {
      issuer: API_HOST,
      expiresIn: '30d',
      ...options,
    };

    // payload : 토큰에 넣을 데이터, 비밀키, 옵션, 콜백함수

    return new Promise((resolve, reject) => {
      jwt.sign(payload, SECRET_KEY, jwtOptions, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  };

  decodeToken = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, SECRET_KEY, (err, decode) => {
        //검증
        if (err) reject(err);
        resolve(decode);
      });
    });
  };
}
