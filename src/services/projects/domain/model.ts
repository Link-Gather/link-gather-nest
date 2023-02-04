import { Column, Entity, PrimaryColumn } from 'typeorm';
import { customAlphabet } from 'nanoid';
import { Aggregate } from '../../../libs/ddd/aggregate';

export const statusType = <const>['recruiting', 'progressing', 'finish', 'close'];
export type StatusType = typeof statusType[number];
export const purposeType = <const>['For Improvement', 'For Practice', 'For Fun'];
export type PurposeType = typeof purposeType[number];

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
  period: string;
  stacks?: string[];
};

@Entity()
export class Project extends Aggregate {
  @PrimaryColumn()
  id!: string;

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
  period!: string;

  @Column('simple-array', { nullable: true })
  stacks?: string[];

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  constructor(args: CtorType) {
    super();
    if (args) {
      this.id = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_', 10)();
      this.title = args.title;
      this.description = args.description;
      this.purpose = args.purpose;
      this.recruitMember = args.recruitMember;
      this.period = args.period;
      this.stacks = args.stacks;
      this.status = 'recruiting';
      this.isRecruiting = true;
    }
  }
}
