import { customAlphabet } from 'nanoid';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Aggregate } from '../../../libs/ddd/aggregate';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_', 20);

type CtorType = {
  userId: string;
  projectId: string;
  content: string;
};

@Entity()
export class Comment extends Aggregate {
  @PrimaryColumn()
  id!: string;

  @Column()
  userId!: string;

  @Column()
  projectId!: string;

  @Column()
  content!: string;

  constructor(args: CtorType) {
    super();
    if (args) {
      this.id = nanoid();
      this.userId = args.userId;
      this.projectId = args.projectId;
      this.content = args.content;
    }
  }
}
