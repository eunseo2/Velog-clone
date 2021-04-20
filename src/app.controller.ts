import { Controller, Get, Res, Query, Redirect } from '@nestjs/common';

import { Response } from 'express';
import { AppService } from './app.service';
import { LoginUserDto } from './auth/dto/login-user.dto';
import { Token } from './lib/token';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly token: Token,
  ) {}
  @Get('/')
  @Redirect()
  async main(
    @Res({ passthrough: true }) res: Response,
    @Query() query: LoginUserDto,
  ) {
    let user = null;
    //console.log(email);
    user = await this.appService.findUserEmail(query.email);
    // console.log(user);
    if (user) {
      const refreshToken = await this.token.generateToken(
        {
          user: user,
        },
        {
          subject: 'refresh_token',
          expiresIn: '30d',
        },
      );

      const accessToken = await this.token.generateToken(
        {
          user: user,
        },
        {
          subject: 'access_token',
          expiresIn: '1h',
        },
      );

      this.token.setTokenCookie(accessToken, refreshToken, res);
      return { url: `http://localhost:3000/`, statuscode: 200 };
    }
    //console.log(code);
  }

  @Get('/recent')
  resent() {
    return 'welcome recent velog ';
  }
}
