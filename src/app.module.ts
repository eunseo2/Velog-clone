import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Google } from './entities/Google.entity';
import { AppService } from './app.service';
import { UserRepository } from './entities/user.repository';
import { Token } from './lib/token';
import { ConsumeTokenMiddleware } from './middleware/consume-token.middleware';
import { UserModule } from './user/user.module';

import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { Post } from './entities/post.entity';
import { Tag } from './entities/tag.entity';

import { PostModule } from './post/post.module';

console.log(__dirname);
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '../static'),
    }),
    TypeOrmModule.forFeature([UserRepository]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),

    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PW,
      database: process.env.DB_DATABASE,
      entities: [User, Google, Post, Tag],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    FileModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService, Token],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ConsumeTokenMiddleware).forRoutes(AppController);
  }
}
