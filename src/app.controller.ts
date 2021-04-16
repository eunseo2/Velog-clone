import { Controller, Get, Res, Query } from '@nestjs/common';

import { Response } from 'express';
import { AppService } from './app.service';
import { LoginUserDto } from './auth/dto/login-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('velog.io')
  async main(
    @Res({ passthrough: true }) res: Response,
    @Query() query: LoginUserDto,
  ) {
    let user = null;
    //console.log(email);
    user = await this.appService.findUserEmail(query.email);
    // console.log(user);
    if (user) {
      const refreshToken = await this.appService.generateToken(
        {
          user: user,
        },
        {
          subject: 'refresh_token',
          expiresIn: '30d',
        },
      );
      const accessToken = await this.appService.generateToken(
        {
          user: user,
        },
        {
          subject: 'access_token',
          expiresIn: '1h',
        },
      );

      const setTokenCookie = (accessToken: string, refreshToken: string) => {
        // respponse 브라우져 (clinet)에 쿠키 생성
        res.cookie('access_token', accessToken, {
          httpOnly: true, // 웹 서버를 통해서만 cookie 접근할 수 있음
          domain: undefined,
          maxAge: 1000 * 60 * 60 * 1, //1hour 만료시간
          secure: false,
        });

        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          domain: undefined,
          maxAge: 1000 * 60 * 60 * 24 * 30, //30day
          secure: false,
        });
      };

      setTokenCookie(accessToken, refreshToken);
      //console.log(accessToken);
      return { statusCode: 200 };
    }
    //console.log(code);

    return 'welcome velog ';
  }

  @Get('velog.io/recent')
  resent() {
    return 'welcome recent velog ';
  }
  @Get('/')
  velogMain() {
    return 'hello ';
  }
}
