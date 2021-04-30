import { Injectable, NotFoundException } from '@nestjs/common';
import { PostDto } from 'src/auth/dto/create-post.dto';
import { Post } from 'src/entities/post.entity';

import { PostRepository } from 'src/entities/post.repository';

import { TagRepository } from 'src/entities/tag.repository';
import { User } from 'src/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
  ) {
    this.postRepository = postRepository;
  }

  // front에서 cookie 값 같이 보내줘야함.

  async createPost(user: User, postdata: PostDto): Promise<void> {
    const newPost = {
      title: postdata.title,
      description: postdata.description,
      isDelete: false,
      user: user,
      tags: postdata.tags,
    };
    await this.postRepository.save(newPost);
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find({
      where: { isDelete: 'false' },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getTrendPosts(): Promise<Post[]> {
    return this.postRepository.find({
      where: { isDelete: 'false' },
      relations: ['user'],
      order: { like: 'DESC' },
    });
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne(id, {
      where: { isDelete: 'false' },
      relations: ['user', 'tags'],
    });
    if (post) {
      return post;
    }
    throw new NotFoundException(id);
  }

  async likeCountUp(id: number): Promise<void> {
    const post = await this.postRepository.findOne(id);
    const updatedata = {
      like: post.like + 1,
    };
    this.postRepository.update(id, updatedata);
  }

  async update(id: number, updatedata) {
    const update = {
      id: id,
      title: updatedata.title,
      description: updatedata.description,
      tags: updatedata.tags,
    };
    await this.postRepository.save(update);
  }
}
