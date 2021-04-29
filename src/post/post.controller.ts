import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';

import { User } from 'src/entities/user.entity';
import { PostService } from './post.service';
type CustomRequest<T> = Request & T;
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Post()
  async create(
    @Req() req: CustomRequest<{ user: User }>,
    @Body() postdata,
  ): Promise<{ statusCode: number }> {
    await this.postService.createPost(req.user, postdata);
    return { statusCode: 201 };
  }
  @Get()
  async getAllPosts() {
    const posts = await this.postService.getAllPosts();
    return posts;
  }

  //like 수 올림
  @Post(':id')
  async likeCountUp(@Param('id') id: number): Promise<{ statusCode: number }> {
    await this.postService.likeCountUp(id);
    return { statusCode: 201 };
  }

  @Get(':id')
  async getPostById(@Param('id') id: number) {
    const post = await this.postService.getPostById(id);
    return post;
  }

  // @Patch(':id')
  // async update(@Param('id') id: number, @Body() updatedata) {
  //   await this.postService.update(id, updatedata);
  // }
}
