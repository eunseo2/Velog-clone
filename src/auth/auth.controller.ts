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
import config from '../config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly token: Token,
  ) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  // goolge login시 redirect
  @Get('redirect')
  @Redirect()
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return await this.authService.googleLogin(req);
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
    const existsUser = await this.authService.findUserID(userData.displayName);
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
        userData.displayName,
        userData.intro,
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
  async login(@Req() req: any) {
    return req.user;
  }

  @Get('login-page')
  @Redirect()
  async main(
    @Res({ passthrough: true }) res: Response,
    @Query() query: LoginUserDto,
  ): Promise<{ url: string }> {
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

      const CLIENT_HOST = config.CLIENT_HOST;
      this.token.setTokenCookie(accessToken, refreshToken, res);
      const url = new URL(CLIENT_HOST);

      return { url: url.toString() };
    }
  }
}
