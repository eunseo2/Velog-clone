import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './passport/google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/entities/user.repository';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import config from '../auth/passport/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: 'smtp.google.com',
        port: 587,
        //secure: false, // true for 465, false for other ports
        auth: {
          type: 'OAuth2',
          user: config.user, // generated ethereal user
          clientId: config.clientID, // generated ethereal password
          clientSecret: config.clientSecret,
          refreshToken: config.refreshToken,
        },
      },

      template: {
        dir: process.cwd() + '/template/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
