import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'title', description: '프로젝트 제목' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'description', description: '프로젝트 설명' })
  @IsNotEmpty()
  @IsString()
  description!: string;
}
