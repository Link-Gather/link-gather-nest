import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { JobType } from '../../users/domain/model';
import { Aggregate } from '../../../libs/ddd/aggregate';

export const roleType = <const>['leader', 'member'];
export type RoleType = (typeof roleType)[number];

type CtorType = {
  userId: string;
  projectId: string;
  type: RoleType;
  job: JobType;
};

@Entity()
export class Role extends Aggregate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: string;

  @Column()
  projectId!: string;

  @Column()
  type!: RoleType;

  @Column()
  job!: JobType;

  constructor(args: CtorType) {
    super();
    if (args) {
      this.userId = args.userId;
      this.projectId = args.projectId;
      this.type = args.type;
      this.job = args.job;
    }
  }
}
