import { EntityRepository, Repository } from 'typeorm';
import { Google } from './Google.entity';

@EntityRepository(Google)
export class GoogleRepository extends Repository<Google> {}
