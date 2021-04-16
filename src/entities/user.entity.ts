import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  provider?: string;
  @Column({ nullable: false })
  email: string;
  @Column({ nullable: true })
  providerName: string;
  @Column({ nullable: true })
  providerID?: string;
  @Column({ nullable: true })
  profile?: string;
  @Column()
  username?: string;
  @Column()
  userID?: string;
  @Column()
  Intro?: string;
}
