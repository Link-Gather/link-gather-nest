import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Aggregate } from '../../../libs/ddd/aggregate';

export const jobType = <const>['FrontendDeveloper', 'BackendDeveloper', 'Designer', 'ProductManager'];
export type JobType = (typeof jobType)[number];

export type RoleType = 'Leader' | 'Member';

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
