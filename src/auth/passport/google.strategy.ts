import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

import { Injectable } from '@nestjs/common';
import config from './config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      callbackURL: 'http://localhost:3000/auth/redirect',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { provider, emails, id, picture, displayName } = profile;
    //console.log(profile);
    const user = {
      provider: provider,
      name: displayName,
      GoogleID: id,
      profile: picture,
      email: emails[0].value,
      //username: name,
      accessToken,
    };
    done(null, user);
  }
}
