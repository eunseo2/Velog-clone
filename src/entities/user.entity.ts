import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  email: string;
  @Column({ nullable: false })
  name: string;
  @Column()
  GoogleID?: string;
  @Column()
  profile?: string;
}
