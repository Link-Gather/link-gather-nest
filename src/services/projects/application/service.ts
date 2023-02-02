import { Injectable } from '@nestjs/common';
import { PostRequestBodyDto } from '../dto/post-dto';
import { ProjectRepository } from '../infrastructure/repository';
import { Project } from '../domain/model';
import { Transactional } from '../../../libs/orm/transactional';

@Injectable()
export class ProjectService {
  constructor(private projectRepository: ProjectRepository) {}

  @Transactional()
  async create(args: PostRequestBodyDto) {
    const project = new Project(args);
    await this.projectRepository.save([project]);
    return project;
  }

  async findByTitle(title: string) {
    return this.projectRepository.find({ title });
  }
}
