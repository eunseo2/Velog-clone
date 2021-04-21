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
    const refresh = async (res: any, refreshToken: string) => {
      try {
        const decoded = await this.token.decodeToken<{ user: User }>(
          refreshToken,
        );
        const user = await this.userRepository.findOne(decoded.user.id);

        if (!user) {
          throw new Error('Invalid user error');
        }

        //refresh를 통해서 accessToken을 생성
        const tokens = await this.token.refreshUserToken(
          decoded.exp,
          refreshToken,
        );

        this.token.setTokenCookie(tokens.accessToken, tokens.accessToken, res);
        return user;
      } catch (err) {
        throw new Error(err);
      }
    };

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
      const diff: number = accessTokenData.exp * 1000 - new Date().getTime();
      if (diff < 1000 * 60 * 30 && refreshToken) {
        await refresh(res, refreshToken);
      }
    } catch (err) {
      if (!refreshToken) {
        console.log('refresh도 없음');
        return next();
      }

      try {
        const user = await refresh(res, refreshToken);
        req.user = user;
      } catch (e) {
        throw new Error(e);
      }
      console.log(err);
      return next();
    }
    next();
  }
}
