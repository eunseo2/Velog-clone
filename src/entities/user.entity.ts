import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  provider?: string;
  @Column({ nullable: false })
  email: string;
  @Column()
  providerName: string;
  @Column()
  providerID?: string;
  @Column()
  profile?: string;
  @Column()
  username?: string;
  @Column()
  userID?: string;
  @Column()
  Intro?: string;
}
