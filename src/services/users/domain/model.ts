import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { nanoid } from 'nanoid';
import { Exclude } from 'class-transformer';
import { Aggregate } from '../../../libs/ddd/aggregate';
import { compareHash, hashPassword } from '../../../libs/password';
import { badRequest } from '../../../libs/exception';

export const providerType = <const>['kakao', 'github', 'google', 'link-gather'];
export type ProviderType = (typeof providerType)[number];
export const jobType = <const>['frontendDeveloper', 'backendDeveloper', 'designer', 'productManager'];
export type JobType = (typeof jobType)[number];

type CtorType = {
  email: string;
  password: string;
  nickname: string;
  profileImage: string;
  provider: ProviderType;
  introduction: string;
  career: number;
  job: JobType;
  stacks: number[];
  urls?: string[];
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
  provider!: ProviderType;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @Column({ nullable: true })
  nicknameUpdatedOn?: CalendarDate;

  @OneToMany(() => Profile, (profile) => profile.user, { cascade: true, eager: true })
  profiles!: Profile[];

  constructor(args: CtorType) {
    super();
    if (args) {
      this.id = nanoid(10);
      this.email = args.email;
      this.password = args.password;
      this.nickname = args.nickname;
      // TODO: 이미지들 미리 s3에 저장하고 image url 로 변환시켜주는 method 를 만들어서 프론트에 반환하도록 한다.
      // https://github.com/Link-Gather/link-gather-nest/pull/28#discussion_r1129592221
      this.profileImage = args.profileImage;
      this.provider = args.provider;
      this.profiles = [
        new Profile({
          career: args.career,
          job: args.job,
          introduction: args.introduction,
          stacks: args.stacks,
          urls: args.urls,
        }),
      ];
    }
  }

  update(args: { refreshToken?: string }) {
    // TODO: 추후 args에 타입이 생기면 여기도 타입선언을 해줘야한다.
    const changedArgs = this.stripUnchanged(args);

    if (!changedArgs) {
      return;
    }

    Object.assign(this, changedArgs);
  }

  async validatePassword(password: string) {
    if (!(await compareHash(password, this.password))) {
      throw badRequest('패스워드가 일치하지 않습니다.', {
        errorMessage: '이메일이나 패스워드가 일치하지 않습니다.',
      });
    }
  }

  async changePassword({ password, passwordConfirm }: { password: string; passwordConfirm: string }) {
    if (password !== passwordConfirm) {
      throw badRequest(`Password(${password}) is not equal to PasswordConfirm(${passwordConfirm})`, {
        errorMessage: `비밀번호와 비밀번호 확인이 일치하지 않습니다.`,
      });
    }

    if (this.provider !== 'link-gather') {
      throw badRequest(`Invalid provider(${this.provider}) is entered. Only link-gather can change password`, {
        errorMessage: '비밀번호를 변경할 수 없는 계정입니다.',
      });
    }
    this.password = await hashPassword(password);
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
  stacks!: number[];

  @ManyToOne(() => User, (user) => user.profiles)
  user!: never;

  constructor(args: { career: number; job: JobType; introduction: string; urls?: string[]; stacks: number[] }) {
    if (args) {
      this.id = nanoid(10);
      this.career = args.career;
      this.job = args.job;
      this.introduction = args.introduction;
      this.urls = args.urls ?? [];
      this.stacks = args.stacks;
    }
  }
}
