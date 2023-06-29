import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClickParamDto {
  @ApiProperty({ example: '5ileReaR2V', description: '프로젝트 id', required: true })
  @IsNotEmpty()
  @IsString()
  projectId!: string;
}
