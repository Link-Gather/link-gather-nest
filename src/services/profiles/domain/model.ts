import { AfterLoad, Column, Entity, PrimaryColumn } from 'typeorm';
import { nanoid } from 'nanoid';
import { Aggregate } from '../../../libs/ddd/aggregate';
import { JobType } from '../../users/domain/model';

type CtorType = {
  career: number;
  job: JobType;
  introduction: string;
  urls?: string[];
  stacks: number[];
  userId: string;
};

@Entity()
export class Profile extends Aggregate {
  @PrimaryColumn()
  id!: string;

  @Column()
  career!: number;

  @Column()
  job!: JobType;

  @Column()
  introduction!: string;

  @Column('simple-array')
  urls!: string[];

  @Column('simple-array')
  stacks!: number[];

  @Column()
  userId!: string;

  constructor(args: CtorType) {
    super();
    if (args) {
      this.id = nanoid(10);
      this.career = args.career;
      this.job = args.job;
      this.introduction = args.introduction;
      this.urls = args.urls ?? [];
      this.stacks = args.stacks;
      this.userId = args.userId;
    }
  }

  @AfterLoad()
  private afterLoad() {
    this.stacks = this.stacks?.map(Number);
  }
}
