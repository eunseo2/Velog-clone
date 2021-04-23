import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/entities/user.repository';
import { Token } from 'src/lib/token';
import { ConsumeTokenMiddleware } from 'src/middleware/consume-token.middleware';
import { NeedsAuthMiddleware } from 'src/middleware/needs-auth.middleware';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),

    MulterModule.register({
      dest: './files',
    }),
  ],
  controllers: [FileController],
  providers: [FileService, Token],
})
export class FileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ConsumeTokenMiddleware).forRoutes(FileController);
    consumer.apply(NeedsAuthMiddleware).forRoutes(FileController);
  }
}
