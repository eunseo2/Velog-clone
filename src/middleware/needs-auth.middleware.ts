import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class NeedsAuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }

    next();
  }
}
