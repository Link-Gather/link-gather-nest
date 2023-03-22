import { customAlphabet } from 'nanoid';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { addDays } from '../../../libs/date';
import { Aggregate } from '../../../libs/ddd/aggregate';
import { badRequest, forbidden } from '../../../libs/exception';

@Entity()
export class Verification extends Aggregate {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  email!: string;

  @Column()
  code!: string;

  @Column({})
  expiredAt!: Date;

  @Column({ nullable: true })
  verifiedAt?: Date;

  constructor(args: { email: string }) {
    super();
    if (args) {
      this.email = args.email;
      this.code = customAlphabet('0123456789', 6)();
      // NOTE: 유효기간 24시간
      this.expiredAt = addDays(new Date(), 1);
    }
  }

  verify(code: string) {
    if (this.expiredAt < new Date()) {
      throw forbidden(`Verification(${this.id}) is expired.`, {
        errorMessage: '인증 코드가 만료되었습니다. 다시 인증해주세요.',
      });
    }

    if (this.code !== code) {
      throw badRequest(`Invalid Code(${code}) is entered.`, {
        errorMessage: '코드가 정확하지 않습니다. 다시 한번 확인해주세요.',
      });
    }

    this.verifiedAt = new Date();
  }
}
