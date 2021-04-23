import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/entities/user.repository';
import { Token } from 'src/lib/token';
import { ConsumeTokenMiddleware } from 'src/middleware/consume-token.middleware';
import { NeedsAuthMiddleware } from 'src/middleware/needs-auth.middleware';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),

    MulterModule.register({
      dest: './files',
    }),
  ],
  controllers: [UserController],
  providers: [UserService, Token],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ConsumeTokenMiddleware).forRoutes(UserController);
    consumer.apply(NeedsAuthMiddleware).forRoutes(UserController);
  }
}
