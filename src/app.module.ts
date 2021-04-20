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
//import { ConsumeTokenMiddleware } from './middleware/consume-token.middleware';

@Module({
  imports: [
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
      entities: [User, Google],
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, Token],
})
export class AppModule {}
// configure(consumer: MiddlewareConsumer) {
//   consumer.apply(ConsumeTokenMiddleware).forRoutes();
// }
