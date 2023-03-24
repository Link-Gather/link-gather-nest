import { UserRepository } from '../../infrastructure/repository';
import { UserSpec } from './index';
import { badRequest } from '../../../../libs/exception';
import type { VerificationType } from '../../../verifications/domain/model';

export class VerificationUserSpec implements UserSpec {
  private type: VerificationType;

  private email: string;

  constructor({ type, email }: { type: VerificationType; email: string }) {
    this.type = type;
    this.email = email;
  }

  async find(userRepository: UserRepository) {
    const [user] = await userRepository.find({
      email: this.email,
    });

    if (this.type === 'signup' && user) {
      throw badRequest(`Invalid email(${this.email}) is entered. Please check the email.`, {
        errorMessage: `중복된 이메일입니다. 다시 입력해주세요.`,
      });
    }

    if (this.type === 'password' && !user) {
      throw badRequest(`Invalid email(${this.email}) is entered. Please check the email.`, {
        errorMessage: `이메일이 존재하지 않습니다. 다시 입력해주세요.`,
      });
    }
    return [user];
  }
}
