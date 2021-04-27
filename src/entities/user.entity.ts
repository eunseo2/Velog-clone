import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  provider?: string;
  @Column({ nullable: false })
  email: string;
  @Column({ nullable: true })
  profile?: string;
  @Column()
  username?: string;
  @Column({ name: 'displayName' })
  displayName?: string;
  @Column()
  intro?: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
