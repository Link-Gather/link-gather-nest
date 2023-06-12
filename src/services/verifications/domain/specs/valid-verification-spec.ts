import { FindOption } from 'libs/orm';
import { forbidden } from '../../../../libs/exception';
import { VerificationRepository } from '../../infrastructure/repository';
import { VerificationSpec } from './index';

export class ValidVerificationSpec implements VerificationSpec {
  private id: string;

  constructor({ id }: { id: string }) {
    this.id = id;
  }

  async find(verificationRepository: VerificationRepository, options?: Partial<FindOption>) {
    const [verification] = await verificationRepository.find({ id: this.id }, options);

    if (!verification) {
      return [];
    }

    if (verification.expiredAt < new Date()) {
      throw forbidden(`Verification(${verification.id}) is expired.`, {
        errorMessage: '인증코드를 재요청 해주세요.',
      });
    }

    if (verification.verifiedAt) {
      throw forbidden(`Verification(${verification.id}) is already verified.`, {
        errorMessage: '인증코드를 재요청 해주세요.',
      });
    }

    return [verification];
  }
}
