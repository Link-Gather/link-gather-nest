import { IsArray, IsIn, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JobType, jobType } from '../../users/domain/model';

export class CreateBodyDto {
  @ApiProperty({ example: 3, description: '경력', required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  career!: number;

  @ApiProperty({ example: 'frontendDeveloper', description: '직무', required: true, enum: jobType })
  @IsNotEmpty()
  @IsString()
  @IsIn(jobType)
  job!: JobType;

  @ApiProperty({ example: 'I am developer', description: '자기소개', required: true })
  @IsNotEmpty()
  @IsString()
  introduction!: string;

  @ApiProperty({ example: [1, 6, 22], description: '기술스택', required: true })
  @IsArray()
  @IsNumber({}, { each: true })
  stacks!: number[];

  @ApiProperty({
    example: ['https://github.com/changchanghwang'],
    description: '블로그, 깃허브 등 주소',
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  urls!: string[];
}
