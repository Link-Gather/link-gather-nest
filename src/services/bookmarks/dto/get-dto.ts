import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListResponseDto {
  @ApiProperty({ example: '1', description: '북마크 id' })
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @ApiProperty({ example: 'projectid1', description: '프로젝트 id' })
  @IsNotEmpty()
  @IsString()
  projectId!: string;

  constructor(args?: ListResponseDto) {
    if (args) {
      this.id = args.id;
      this.projectId = args.projectId;
    }
  }
}
