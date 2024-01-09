import { AfterLoad, Column, Entity, PrimaryColumn } from 'typeorm';
import { nanoid } from 'nanoid';
import { Aggregate } from '../../../libs/ddd/aggregate';

export const statusType = <const>['recruiting', 'progressing', 'additionalRecruitment', 'finish', 'close'];
export type StatusType = (typeof statusType)[number];
export const purposeType = <const>['improvement', 'business', 'fun', 'study'];
export type PurposeType = (typeof purposeType)[number];
export const orderType = <const>['latest', 'popularity', 'oldest'];
export type OrderType = (typeof orderType)[number];

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
  stacks?: number[];
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
  period!: number;

  @Column('simple-json', { nullable: true })
  stacks?: number[];

  @Column()
  bookMarkCount!: number;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  constructor(args: CtorType) {
    super();
    if (args) {
      this.id = nanoid(10);
      this.title = args.title;
      this.description = args.description;
      this.purpose = args.purpose;
      this.recruitMember = args.recruitMember;
      this.period = args.period;
      this.stacks = args.stacks;
      this.status = 'recruiting';
      this.bookMarkCount = 0;
      this.isRecruiting = true;
    }
  }

  @AfterLoad()
  private postLoad() {
    this.stacks = this.stacks?.map(Number);
  }

  bookmarkCountChange(isBookmarked: boolean) {
    this.bookMarkCount += isBookmarked ? -1 : 1;
  }
}
