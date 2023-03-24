import type { FindOrder } from '../../../../libs/orm';
import type { UserRepository } from '../../infrastructure/repository';
import type { User } from '../model';

export interface UserSpec {
  find(userRepository: UserRepository, options?: { page?: number; limit?: number }, order?: FindOrder): Promise<User[]>;
}
