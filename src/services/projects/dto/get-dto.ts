import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { purposeType, PurposeType, statusType, StatusType, sortType, SortType } from '../domain/model';
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

export class ListQueryDto {
  @ApiProperty({ example: ['node.js', 'react', 'spring'], description: '기술스택', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stacks?: string[];

  @ApiProperty({ example: 'Fun', description: '프로젝트 목적', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsIn(purposeType)
  purpose?: PurposeType;

  @ApiProperty({ example: 'BackendDeveloper', description: '직무', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIn(jobType)
  job?: JobType;

  @ApiProperty({ example: 'progressing', description: '프로젝트 진행 상태', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIn(statusType)
  status?: StatusType;

  @ApiProperty({ example: 'Latest', description: '프로젝트 목록 정렬 기준', default: 'Latest', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIn(sortType)
  sort?: SortType = 'Latest';

  @ApiProperty({ example: '1', description: '페이지네이션용 page', default: '1', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  page?: string = '1';

  @ApiProperty({ example: '16', description: '페이지네이션용 limit', default: '16', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  limit?: string = '16';
}

export class ListResponseDto {
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

  @ApiProperty({ example: 'progressing', description: '프로젝트 진행 상태', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIn(statusType)
  status!: StatusType;

  @ApiProperty({ example: 1, description: '프로젝트 기간' })
  @IsNotEmpty()
  @IsNumber()
  period!: number;

  @ApiProperty({ example: ['node.js', 'react', 'spring'], description: '기술스택', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stacks?: string[];

  @ApiProperty({ example: 10, description: '프로젝트 북마크 갯수' })
  @IsNotEmpty()
  @IsNumber()
  bookMarkCount!: number;

  constructor(args?: ListResponseDto) {
    if (args) {
      this.id = args.id;
      this.title = args.title;
      this.description = args.description;
      this.purpose = args.purpose;
      this.recruitMember = args.recruitMember;
      this.period = args.period;
      this.stacks = args.stacks;
      this.bookMarkCount = args.bookMarkCount;
    }
  }
}
