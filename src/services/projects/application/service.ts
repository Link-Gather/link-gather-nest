import { Injectable } from '@nestjs/common';
import { CreateDto } from '../dto';
import { ProjectRepository } from '../infrastructure/repository';
import { Project } from '../domain/model';
import { Transactional } from '../../../libs/orm/transactional';

@Injectable()
export class ProjectService {
  constructor(private projectRepository: ProjectRepository) {}

  @Transactional()
  async create(createDto: CreateDto) {
    const project = new Project(createDto);
    await this.projectRepository.save([project]);
    return project;
  }

  async findByTitle(title: string) {
    return this.projectRepository.find({ title });
  }
}
