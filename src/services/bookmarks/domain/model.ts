import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Aggregate } from '../../../libs/ddd/aggregate';

type CtorType = {
  userId: string;
  projectId: string;
};

@Entity()
export class Bookmark extends Aggregate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: string;

  @Column()
  projectId!: string;

  constructor(args: CtorType) {
    super();
    if (args) {
      this.userId = args.userId;
      this.projectId = args.projectId;
    }
  }
}
