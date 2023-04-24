import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Aggregate } from '../../../libs/ddd/aggregate';

type CtorType = {
  name: string;
  length: number;
};

@Entity()
export class Stack extends Aggregate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  length!: number;

  constructor(args: CtorType) {
    super();
    if (args) {
      this.name = args.name;
      this.length = args.length;
    }
  }
}
