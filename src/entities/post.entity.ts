import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
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
  @Column({ type: 'text' })
  description: string;
  @Column({ default: 0 })
  like?: number;
  // snake => Camelcase
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
  @Column({ name: 'is_delete' })
  isDelete?: boolean;

  //n:1 관계
  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable()
  tags: Tag[];
}
