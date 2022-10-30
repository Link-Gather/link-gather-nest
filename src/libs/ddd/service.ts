import { Inject } from '@nestjs/common';
import { EntityManager } from 'typeorm';

export class Service {
  @Inject('entityManager') protected entityManager!: EntityManager;
}
