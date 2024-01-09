import { Injectable } from '@nestjs/common';
import { Repository } from '@libs/ddd';
import { Stack } from '../domain/model';

@Injectable()
export class StackRepository extends Repository<Stack, Stack['id']> {
  entityClass = Stack;

  async find(): Promise<Stack[]> {
    return this.getManager().find(Stack);
  }
}
