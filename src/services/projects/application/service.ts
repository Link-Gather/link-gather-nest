import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project-dto';
import { ProjectRepository } from '../infrastructure/repository';
import { Project } from '../domain/model';
import { Transactional } from '../../../libs/orm/transactional';

@Injectable()
export class ProjectService {
  constructor(private projectRepository: ProjectRepository) {}

  @Transactional()
  async create(createProjectDto: CreateProjectDto) {
    const project = new Project(createProjectDto);
    await this.projectRepository.save([project]);
    return project;
  }

  async findByTitle(title: string) {
    return this.projectRepository.find({ title });
  }
}
