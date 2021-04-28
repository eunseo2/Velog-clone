import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import { Response } from 'express';
const IS_DEV = process.env.NODE_ENV !== 'production';

const { SECRET_KEY, CLIENT_HOST, API_HOST } = config;
if (!SECRET_KEY || !CLIENT_HOST || !API_HOST) {
  throw new Error('MISSING_ENVAR');
}

type Decode<T> = {
  iat: number;
  exp: number;
  iss: string;
} & T;

@Injectable()
export class Token {
  generateToken = (payload, options: jwt.SignOptions): Promise<string> => {
    console.log('payload', payload, options);
    const jwtOptions = {
      issuer: API_HOST,
      expiresIn: 1000 * 60 * 60 * 24 * 30,
      ...options,
    };

    return new Promise((resolve, reject) => {
      jwt.sign(payload, SECRET_KEY, jwtOptions, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  };

  decodeToken = <T>(token: string): Promise<Decode<T>> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, SECRET_KEY, (err, decode: Decode<T>) => {
        //검증
        if (err) {
          reject(err);
          return;
        }
        console.log('decode', decode);
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
      domain: !IS_DEV ? CLIENT_HOST : undefined,
      maxAge: 1000 * 60 * 60 * 1, //1hour 만료시간
      secure: false,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      domain: !IS_DEV ? CLIENT_HOST : undefined,
      maxAge: 1000 * 60 * 60 * 24 * 30, //30day
      secure: false,
    });
  };

  async refreshUserToken(
    refreshTokenExp: number,
    originalRefreshToken: string,
  ) {
    const now = new Date().getTime();
    const diff = refreshTokenExp * 1000 - now;
    let refreshToken = originalRefreshToken;

    //15일 이하인 경우
    if (diff < 1000 * 60 * 60 * 24 * 15) {
      refreshToken = await this.generateToken(
        {
          user: this,
        },
        {
          subject: 'refresh_token',
          expiresIn: '30 days',
        },
      );
    }
    const accessToken = await this.generateToken(
      {
        user: this,
      },
      {
        subject: 'access_token',
        expiresIn: '1h',
      },
    );
    return { refreshToken, accessToken };
  }
}
