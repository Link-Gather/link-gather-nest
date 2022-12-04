import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Aggregate } from '../../../libs/ddd/aggregate';
import { CreateProjectDto } from '../dto/create-project-dto';

export const statusType = <const>['recruiting', 'progressing', 'finish', 'close'];
export type StatusType = typeof statusType[number];

@Entity()
export class Project extends Aggregate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  status!: StatusType;

  constructor(args: CreateProjectDto) {
    super();
    if (args) {
      this.title = args.title;
      this.description = args.description;
      this.status = 'recruiting';
    }
  }
}
