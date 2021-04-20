import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import { Response } from 'express';

const { SECRET_KEY, CLIENT_HOST, API_HOST } = config;
if (!SECRET_KEY || !CLIENT_HOST || !API_HOST) {
  throw new Error('MISSING_ENVAR');
}

@Injectable()
export class Token {
  generateToken = (payload, options): Promise<string> => {
    console.log('payload', payload, options);
    const jwtOptions = {
      issuer: API_HOST,
      expiresIn: '30d',
      ...options,
    };

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

  setTokenCookie = (
    accessToken: string,
    refreshToken: string,
    res: Response,
  ) => {
    // respponse 브라우져 (clinet)에 쿠키 생성
    res.cookie('access_token', accessToken, {
      httpOnly: true, // 웹 서버를 통해서만 cookie 접근할 수 있음
      domain: CLIENT_HOST,
      maxAge: 1000 * 60 * 60 * 1, //1hour 만료시간
      secure: false,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      domain: CLIENT_HOST,
      maxAge: 1000 * 60 * 60 * 24 * 30, //30day
      secure: false,
    });
  };
}
