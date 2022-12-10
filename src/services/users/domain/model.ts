import { Column, Entity, PrimaryColumn } from 'typeorm';
import { customAlphabet } from 'nanoid';
import { Aggregate } from '../../../libs/ddd/aggregate';
import type { CreateUserDto } from '../dto/create-user-dto';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_', 20);
export const providerType = <const>['Kakao', 'Github', 'Google', 'Link-Gather'];
export type ProviderType = typeof providerType[number];
export const jobType = <const>['Developer', 'Designer', 'Product Manager', 'Other'];
export type JobType = typeof jobType[number];
@Entity()
export class User extends Aggregate {
  @PrimaryColumn()
  id!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  nickname!: string;

  @Column()
  profile!: string;

  @Column()
  provider!: ProviderType;

  @Column()
  introduction!: string;

  @Column()
  career!: number;

  @Column()
  job!: JobType;

  @Column('simple-array', { nullable: true })
  stacks?: string[];

  @Column('simple-array', { nullable: true })
  urls?: string[];

  @Column({ nullable: true })
  refreshToken?: string;

  constructor(args: CreateUserDto) {
    super();
    if (args) {
      this.id = nanoid();
      this.email = args.email;
      this.password = args.password;
      this.nickname = args.nickname;
      this.profile = args.profile || 'linkgather image url';
      this.provider = args.provider;
      this.introduction = args.introduction || '';
      this.stacks = args.stacks;
      this.urls = args.urls;
    }
  }
}
