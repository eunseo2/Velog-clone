// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Token } from '../lib/token';

// @Injectable()
// export class ConsumeTokenMiddleware implements NestMiddleware {
//   constructor(
//     private readonly userRepository: UserRepository,
//     private readonly token: Token,
//   ) {
//     this.userRepository = userRepository;
//   }
//   use(req: any, res: any, next: () => void) {
//     const consumeToken = async (req, res, next) => {
//       const {
//         access_token: accessToken,
//         refresh_token: refreshToken,
//       } = req.cookies;

//       try {
//         if (!accessToken) {
//           throw new Error('No access token');
//         }

//         const accessTokenData = await this.token.decodeToken(accessToken);
//         const { id: userId } = accessTokenData.User;
//         const user = await this.userRepository.findByIds(userId);
//         req.user = user;
//       } catch (err) {}

//       return next();
//     };
//   }
// }
