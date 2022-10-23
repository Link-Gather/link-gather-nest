import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../infrastructure/repository';
import { User } from '../domain/model';

@Injectable()
export class UserService {
  //생성자 부분에 가져와 사용한다.
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}
}
