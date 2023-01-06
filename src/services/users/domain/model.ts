import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { customAlphabet } from 'nanoid';
import { Exclude } from 'class-transformer';
import { Aggregate } from '../../../libs/ddd/aggregate';

export const providerType = <const>['Kakao', 'Github', 'Google', 'Link-Gather'];
export type ProviderType = typeof providerType[number];
export const jobType = <const>['Developer', 'Designer', 'Product Manager', 'Other'];
export type JobType = typeof jobType[number];

type CtorType = {
  email: string;
  password: string;
  nickname: string;
  profileImage?: string;
  provider: ProviderType;
  introduction?: string;
  career: number;
  job: JobType;
  stacks: string[];
  urls?: string[];
  profiles: Profile;
};

@Entity()
export class User extends Aggregate {
  @PrimaryColumn()
  id!: string;

  @Column()
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column()
  nickname!: string;

  @Column()
  profileImage!: string;

  @Column()
  @Exclude()
  provider!: ProviderType;

  @Column()
  introduction!: string;

  @Column()
  // TODO: 추후 타입이 정해지면 그때 다시 custom type으로 변경한다.
  career!: number;

  @Column()
  job!: JobType;

  @Column('simple-array')
  stacks!: string[];

  @Column('simple-array')
  urls!: string[];

  @Column({ nullable: true })
  refreshToken?: string;

  @OneToMany(() => Profile, (profile) => profile.user, { cascade: true, eager: true })
  profiles!: Profile[];

  constructor(args: CtorType) {
    super();
    if (args) {
      this.id = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_', 10)();
      this.email = args.email;
      this.password = args.password;
      this.nickname = args.nickname;
      // TODO: 기본 이미지 url이 생기면 변경해야한다.
      this.profileImage = args.profileImage ?? 'linkgather image url';
      this.provider = args.provider;
      this.introduction = args.introduction ?? '';
      this.stacks = args.stacks;
      this.urls = args.urls ?? [];
      this.profiles = [args.profiles];
    }
  }
}

@Entity()
export class Profile {
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
  stacks!: string[];

  @ManyToOne(() => User, (user) => user.profiles)
  user!: never;

  constructor(args: { career: number; job: JobType; introduction: string; urls?: string[]; stacks: string[] }) {
    if (args) {
      this.id = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_', 10)();
      this.career = args.career;
      this.job = args.job;
      this.introduction = args.introduction;
      this.urls = args.urls ?? [];
      this.stacks = args.stacks;
    }
  }
}
