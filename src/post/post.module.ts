import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from 'src/entities/post.repository';
import { TagRepository } from 'src/entities/tag.repository';
import { UserRepository } from 'src/entities/user.repository';
import { Token } from 'src/lib/token';
import { ConsumeTokenMiddleware } from 'src/middleware/consume-token.middleware';
import { NeedsAuthMiddleware } from 'src/middleware/needs-auth.middleware';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository, UserRepository, TagRepository]),
  ],
  controllers: [PostController],
  providers: [PostService, Token],
})
export class PostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ConsumeTokenMiddleware).forRoutes(PostController);
    consumer.apply(NeedsAuthMiddleware).forRoutes(PostController);
  }
}
