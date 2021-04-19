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
  Post,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterDto } from './dto/register-user.dto';
import { getConnection } from 'typeorm';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @HttpCode(200)
  @Get('redirect')
  @Redirect()
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('mail')
  async mail(@Body() userData: LoginUserDto) {
    const user = await this.authService.findUserEmail(userData.email);

    if (!user) {
      const CodeEmail = await this.authService.sendRegisterMail(userData.email);
      console.log(
        `email ID ${userData.email} not found 회원가입 메일 요청했습니다`,
      );
      return CodeEmail;
    } else {
      const email = await this.authService.sendloginMail(userData.email);
      console.log(`${userData.email}로 로그인 요청했습니다`);
      return email;
    }
  }

  @Post('register')
  async register(
    @Body() userData: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const existsUser = await this.authService.findUserName(userData.username);
    console.log(existsUser);

    if (existsUser) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: [`이름이 중복되었습니다.`],
        error: 'Forbidden',
      });
    }
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    queryRunner.startTransaction();
    try {
      const user = await this.authService.saveUser(
        userData.provider,
        userData.email,
        userData.username,
        userData.userID,
        userData.Intro,
      );
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
      };

      setTokenCookie(accessToken, refreshToken);
      return { statusCode: 200 };
    } catch (err) {
      queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
    }
  }
  @Get('register-form')
  async main(@Query() query: LoginUserDto) {
    return query.email;
  }
}
