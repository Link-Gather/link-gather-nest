import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { purposeType, PurposeType } from '../domain/model';
import { JobType, jobType } from '../../roles/domain/model';

class RecruitMemberDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({ example: 1, description: '프론트 개발자 인원 수' })
  frontendDeveloper!: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({ example: 3, description: '백엔드 개발자 인원 수' })
  backendDeveloper!: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({ example: 2, description: '디자이너 인원 수' })
  designer!: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({ example: 4, description: '기획 인원 수' })
  productManager!: number;
}

export class CreateBodyDto {
  @ApiProperty({ example: 'title', description: '프로젝트 제목' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'description', description: '프로젝트 설명' })
  @IsNotEmpty()
  @IsString()
  description!: string;

  @ApiProperty({ example: 'Fun', description: '프로젝트 목적' })
  @IsNotEmpty()
  @IsIn(purposeType)
  purpose!: PurposeType;

  @ApiProperty({
    example: { frontendDeveloper: 2, backendDeveloper: 2, designer: 1, productManager: 1 },
    description: '프로젝트 정원',
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RecruitMemberDto)
  recruitMember!: RecruitMemberDto;

  @ApiProperty({ example: 1, description: '프로젝트 기간 (개월 단위)' })
  @IsNotEmpty()
  @IsNumber()
  period!: number;

  @ApiProperty({ example: ['node.js', 'react', 'spring'], description: '기술스택', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stacks?: string[];

  @IsString()
  @IsIn(jobType)
  @ApiProperty({ example: 'FrontendDeveloper', description: '리더 직업 id' })
  leaderJob!: JobType;
}

export class CreateResponseDto {
  @ApiProperty({ example: 'AB23QD428', description: '프로젝트 id' })
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty({ example: 'title', description: '프로젝트 제목' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'description', description: '프로젝트 설명' })
  @IsNotEmpty()
  @IsString()
  description!: string;

  @ApiProperty({ example: 'Fun', description: '프로젝트 목적' })
  @IsNotEmpty()
  @IsIn(purposeType)
  purpose!: PurposeType;

  @ApiProperty({
    example: { frontendDeveloper: 2, backendDeveloper: 2, designer: 1, productManager: 1 },
    description: '프로젝트 정원',
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RecruitMemberDto)
  recruitMember!: RecruitMemberDto;

  @ApiProperty({ example: 1, description: '프로젝트 기간' })
  @IsNotEmpty()
  @IsNumber()
  period!: number;

  @ApiProperty({ example: ['node.js', 'react', 'spring'], description: '기술스택', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stacks?: string[];

  constructor(args?: CreateResponseDto) {
    if (args) {
      this.id = args.id;
      this.title = args.title;
      this.description = args.description;
      this.purpose = args.purpose;
      this.recruitMember = args.recruitMember;
      this.period = args.period;
      this.stacks = args.stacks;
    }
  }
}
