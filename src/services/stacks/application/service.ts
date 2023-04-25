import { Injectable } from '@nestjs/common';
import { StackRepository } from '../infrastructure/repository';

@Injectable()
export class StackService {
  constructor(private stackRepository: StackRepository) {}

  async list() {
    return this.stackRepository.find();
  }
}
