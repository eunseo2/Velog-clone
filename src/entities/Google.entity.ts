import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Google {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  provider: string;
  @Column()
  email: string;
  @Column()
  providerName: string;
  @Column()
  providerID?: string;
  @Column()
  profile?: string;
}
