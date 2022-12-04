import { IsArray, IsIn, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { purposeType, PurposeType, statusType, StatusType } from '../domain/model';

class RecruitMemberDto {
  @IsNumber()
  @Min(0)
  developer!: number;

  @IsNumber()
  @Min(0)
  designer!: number;

  @IsNumber()
  @Min(0)
  productManager!: number;
}

export class CreateProjectDto {
  @ApiProperty({ example: 'title', description: '프로젝트 제목' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'description', description: '프로젝트 설명' })
  @IsNotEmpty()
  @IsString()
  description!: string;

  @ApiProperty({ example: 'For Fun', description: '프로젝트 목적' })
  @IsNotEmpty()
  @IsIn(purposeType)
  purpose!: PurposeType;

  @ApiProperty({ example: { developer: 3, designer: 1, productManager: 1 }, description: '프로젝트 정원' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RecruitMemberDto)
  recruitMember!: RecruitMemberDto;

  @ApiProperty({ example: '1 개월', description: '프로젝트 기간' })
  @IsNotEmpty()
  @IsString()
  period!: string;

  @ApiProperty({ example: ['node.js', 'react', 'spring'], description: '기술스택', required: false })
  @IsArray()
  @IsString({ each: true })
  stacks?: string[];
}
