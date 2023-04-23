import { customAlphabet } from 'nanoid';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { addHours, addMinutes } from '../../../libs/date';
import { Aggregate } from '../../../libs/ddd/aggregate';
import { badRequest } from '../../../libs/exception';

export const verificationType = <const>['signup', 'password'];
export type VerificationType = (typeof verificationType)[number];

@Entity()
export class Verification extends Aggregate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  code!: string;

  @Column()
  expiredAt!: Date;

  @Column({ nullable: true })
  verifiedAt?: Date;

  @Column()
  type!: VerificationType;

  constructor(args: { email: string; type: VerificationType }) {
    super();
    if (args) {
      this.email = args.email;
      this.code = args.type === 'signup' ? customAlphabet('0123456789', 6)() : '';
      // NOTE: 회원가입 이메일 인증 유효기간 3분, 비밀번호 찾기 유효기간 1시간
      this.expiredAt = args.type === 'signup' ? addMinutes(new Date(), 3) : addHours(new Date(), 1);
      this.type = args.type;
    }
  }

  verify(code?: string) {
    if (code && this.code !== code) {
      throw badRequest(`Invalid Code(${code}) is entered.`, {
        errorMessage: '코드가 정확하지 않습니다. 다시 한번 확인해주세요.',
      });
    }

    this.verifiedAt = new Date();
  }
}
