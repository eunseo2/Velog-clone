import { PartialType } from '@nestjs/mapped-types';
import { Post } from 'src/entities/post.entity';

export class PostDto extends PartialType(Post) {} //?는 필수 아니라는 뜻.
