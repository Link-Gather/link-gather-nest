import { VerificationRepository } from '../../infrastructure/repository';
import { Verification } from '../model';

export interface VerificationSpec {
  find(verificationRepository: VerificationRepository): Promise<Verification[]>;
}
