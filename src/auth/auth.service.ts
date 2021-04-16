import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/entities/user.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterDto } from './dto/register-user.dto';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import { User } from 'src/entities/user.entity';
const generateRandom = function (min: number, max: number) {
  const ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return ranNum;
};

const { SECRET_KEY, CLIENT_HOST, API_HOST } = config;
console.log(SECRET_KEY);

if (!SECRET_KEY || !CLIENT_HOST || !API_HOST) {
  throw new Error('MISSING_ENVAR');
}

type CustomRequest<T> = Request & T;

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService,
  ) {
    this.userRepository = userRepository;
  }
  async googleLogin(req: CustomRequest<{ user: User }>) {
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

  async sendMail(email: string) {
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
        <p><a href="http://localhost:3000/register">회원가입 하러 가기 </a></p>
        <p>이 메일을 요청한 적이 없으시다면 무시하시기 바랍니다.</p>
      `,
      });
      return code;
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
        <p><a href="http://localhost:3000/velog.io">시작하기</a></p>
      
      `,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async saveUser(
    email: string,
    username: string,
    userID: string,
    intro: string,
  ) {
    const Newuser: RegisterDto = {
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
    console.log('ss', jwt.sign(payload, SECRET_KEY, jwtOptions));

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
