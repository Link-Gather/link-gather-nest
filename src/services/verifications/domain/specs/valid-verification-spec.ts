import { forbidden } from '../../../../libs/exception';
import { VerificationRepository } from '../../infrastructure/repository';
import { VerificationSpec } from './index';

export class ValidVerificationSpec implements VerificationSpec {
  private id: number;

  constructor({ id }: { id: number }) {
    this.id = id;
  }

  async find(verificationRepository: VerificationRepository) {
    const [verification] = await verificationRepository.find({ id: this.id }, { lock: { mode: 'pessimistic_write' } });

    if (verification.expiredAt < new Date()) {
      throw forbidden(`Verification(${verification.id}) is expired.`, {
        errorMessage: '인증 코드가 만료되었습니다. 다시 인증해주세요.',
      });
    }

    return [verification];
  }
}