import { EntityRepository, Repository } from 'typeorm';
import { User } from '../domain/model';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
