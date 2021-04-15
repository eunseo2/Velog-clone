import {
  Body,
  Controller,
  Get,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { HttpCode } from '@nestjs/common';

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

  @Get('login')
  async login(@Body() userData: LoginUserDto) {
    const user = await this.authService.login(userData.email);
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
}
