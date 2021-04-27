import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from './tag.entity';
import { User } from './user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  like: number;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
  @Column({ name: 'is_delete' })
  isDelete: boolean;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}
