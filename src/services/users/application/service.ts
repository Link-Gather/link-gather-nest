import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user-dto';
import { UserRepository } from '../infrastructure/repository';
import { User } from '../domain/model';
import { Service } from '../../../libs/ddd/service';
import { Transactional } from '../../../libs/orm/transactional';

@Injectable()
export class UserService extends Service {
  constructor(private userRepository: UserRepository) {
    super();
  }

  @Transactional()
  async create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);
    await this.userRepository.save([user]);
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.find({ email });
  }
}
