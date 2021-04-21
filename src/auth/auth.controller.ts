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
import { Token } from '../lib/token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly token: Token,
  ) {}

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

  @Post('mail')
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
    const existsEmail = await this.authService.findUserEmail(userData.email);

    if (existsUser) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: [`이름이 중복되었습니다.`],
        error: 'Forbidden',
      });
    }
    if (existsEmail) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: [`이미 가입하셨습니다.`],
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
      return { statusCode: 200 };
    } catch (err) {
      queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
    }
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }

  @Get('login')
  @Redirect()
  async main(
    @Res({ passthrough: true }) res: Response,
    @Query() query: LoginUserDto,
  ) {
    let user = null;

    user = await this.authService.findUserEmail(query.email);

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
  }
}
