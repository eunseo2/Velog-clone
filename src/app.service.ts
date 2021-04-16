import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/entities/user.repository';

import * as jwt from 'jsonwebtoken';
import config from './config';

const { SECRET_KEY, CLIENT_HOST, API_HOST } = config;

if (!SECRET_KEY || !CLIENT_HOST || !API_HOST) {
  throw new Error('MISSING_ENVAR');
}

@Injectable()
export class AppService {
  constructor(private readonly userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async findUserEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    return user;
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
