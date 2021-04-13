import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { NotFoundException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('login')
  async login(@Body() userData: LoginUserDto) {
    const user = await this.authService.login(userData.email);
    if (!user) {
      throw new NotFoundException(`email ID ${userData.email} not found`);
    }
    return user;
  }
}
