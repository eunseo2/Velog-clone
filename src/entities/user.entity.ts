import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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
  @Column()
  display_name?: string;
  @Column()
  intro?: string;
  @CreateDateColumn()
  create_at?: Date;
}
