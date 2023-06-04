import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../infrastructure/repository';

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  async list({ projectIds }: { projectIds?: string[] }) {
    return this.roleRepository.find({ projectIds });
  }
}
