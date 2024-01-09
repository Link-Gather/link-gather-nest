import { FindOption } from '@libs/orm';
import { VerificationRepository } from '../../infrastructure/repository';
import { Verification } from '../model';

export interface VerificationSpec {
  find(verificationRepository: VerificationRepository, options?: Partial<FindOption>): Promise<Verification[]>;
}
