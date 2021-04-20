import { Injectable, NestMiddleware } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/entities/user.repository';
import { Token } from '../lib/token';

@Injectable()
export class ConsumeTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly token: Token,
  ) {
    this.userRepository = userRepository;
  }
  async use(req: any, res: any, next: () => void) {
    console.log('ss');
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
    } = req.cookies;

    try {
      if (!accessToken) {
        throw new Error('No access token');
      }

      const accessTokenData = await this.token.decodeToken<{ user: User }>(
        accessToken,
      );
      const { id: userId } = accessTokenData.user;
      const user = await this.userRepository.findOne(userId);
      console.log('decode~~~~:', accessTokenData);
      req.user = user;
    } catch (err) {
      console.log(err);
      return next();
    }
    next();
  }
}
