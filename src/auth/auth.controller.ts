import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Redirect,
  Req,
  Res,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @HttpCode(201)
  @Get('redirect')
  @Redirect('http://localhost:3000/velog.io', 302)
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('mail')
  async mail(@Body() userData: LoginUserDto) {
    const user = await this.authService.findUserEmail(userData.email);
    if (!user) {
      const result = await this.authService.sendMail(userData.email);
      console.log(
        `email ID ${userData.email} not found 인증코드 발송했습니다.`,
      );
      return result;
    } else {
      const result = await this.authService.sendMail2(userData.email);
      console.log(`${userData.email}로 로그인 요청했습니다`);
      return result;
    }
  }

  @Get('register')
  async register(
    @Body() userData: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const existsUser = await this.authService.findUserName(userData.username);
    console.log(existsUser);

    if (existsUser) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: [`이미 등록된 사용자입니다.`],
        error: 'Forbidden',
      });
    }

    const user = await this.authService.saveUser(
      userData.email,
      userData.username,
      userData.userID,
      userData.Intro,
    );
    console.log(user);

    const refreshToken = await this.authService.generateToken(
      {
        user: user,
      },
      {
        subject: 'refresh_token',
        expiresIn: '30d',
      },
    );

    const accessToken = await this.authService.generateToken(
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
      console.log('실행');
    };

    setTokenCookie(accessToken, refreshToken);

    return { statusCode: 200 };
  }
}
