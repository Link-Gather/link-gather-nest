import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Aggregate } from '../../../libs/ddd/aggregate';

export const statusType = <const>['recruiting', 'progressing', 'finish', 'close'];
export type StatusType = (typeof statusType)[number];
export const purposeType = <const>['Improvement', 'Business', 'Fun', 'Study'];
export type PurposeType = (typeof purposeType)[number];
export const sortType = <const>['latest', 'hot', 'oldest'];
export type SortType = (typeof sortType)[number];

type RecruitMember = {
  frontendDeveloper: number;
  backendDeveloper: number;
  designer: number;
  productManager: number;
};

type CtorType = {
  title: string;
  description: string;
  purpose: PurposeType;
  recruitMember: RecruitMember;
  period: number;
  stacks?: string[];
};

@Entity()
export class Project extends Aggregate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  status!: StatusType;

  @Column()
  purpose!: PurposeType;

  @Column()
  isRecruiting!: boolean;

  @Column('simple-json')
  recruitMember!: RecruitMember;

  @Column()
  period!: number;

  @Column('simple-array', { nullable: true })
  stacks?: string[];

  @Column()
  bookMark!: number;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  constructor(args: CtorType) {
    super();
    if (args) {
      this.title = args.title;
      this.description = args.description;
      this.purpose = args.purpose;
      this.recruitMember = args.recruitMember;
      this.period = args.period;
      this.stacks = args.stacks;
      this.status = 'recruiting';
      this.bookMark = 0;
      this.isRecruiting = true;
    }
  }
}
