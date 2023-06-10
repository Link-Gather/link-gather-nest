import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { purposeType, PurposeType, statusType, StatusType, orderType, OrderType } from '../domain/model';
import { JobType, ProviderType, jobType, providerType } from '../../users/domain/model';
import { RoleType, roleType } from '../../roles/domain/model';
import { RecruitMemberDto } from './post-dto';

class MemberDto {
  @ApiProperty({ example: 'C03n5-28', description: '유저 id' })
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty({ example: 'test@test.com', description: '유저 이메일' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'windy', description: '유저 닉네임' })
  @IsNotEmpty()
  @IsString()
  nickname!: string;

  @ApiProperty({ example: 'http://www.link-gather.co.kr/s3/profile-image', description: '유저 닉네임' })
  @IsNotEmpty()
  @IsString()
  profileImage!: string;

  @ApiProperty({ example: 'kakao', description: '회원가입 정보 제공자' })
  @IsNotEmpty()
  @IsIn(providerType)
  provider!: ProviderType;

  @ApiProperty({ example: 'backendDeveloper', description: '직무' })
  @IsNotEmpty()
  @IsString()
  @IsIn(jobType)
  job!: JobType;

  @ApiProperty({ example: 'kakao', description: '회원가입 정보 제공자' })
  @IsNotEmpty()
  @IsIn(roleType)
  type!: RoleType;
}

export class ListQueryDto {
  @ApiProperty({ example: ['1', '6', '18'], description: '기술스택', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stacks?: string[];

  @ApiProperty({ example: 'fun', description: '프로젝트 목적', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsIn(purposeType)
  purpose?: PurposeType;

  @ApiProperty({ example: 'backendDeveloper', description: '직무', required: false })
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

  @ApiProperty({ example: 'latest', description: '프로젝트 목록 정렬 기준', default: 'Latest', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIn(orderType)
  order?: OrderType = 'latest';

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

  @ApiProperty({ example: 'fun', description: '프로젝트 목적' })
  @IsNotEmpty()
  @IsIn(purposeType)
  purpose!: PurposeType;

  @ApiProperty({ example: 'true', description: '팀원 모집 여부' })
  @IsBoolean()
  isRecruiting!: boolean;

  @ApiProperty({
    example: { frontendDeveloper: 2, backendDeveloper: 2, designer: 1, productManager: 1 },
    description: '프로젝트 정원',
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RecruitMemberDto)
  recruitMember!: RecruitMemberDto;

  @ApiProperty({
    example: [
      {
        id: 'b-24nT302A',
        email: 'test@test.com',
        nickname: 'windy',
        profileImage: 'http://www.link-gather.co.kr/s3/profile-image',
        provider: 'kakao',
        job: 'backendDeveloper',
        type: 'leader',
      },
    ],
    description: '프로젝트 멤버',
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  members!: MemberDto[];

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

  @ApiProperty({ example: [1, 6, 18], description: '기술스택', required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  stacks?: number[];

  @ApiProperty({ example: 10, description: '프로젝트 북마크 갯수' })
  @IsNotEmpty()
  @IsNumber()
  bookMarkCount!: number;

  @ApiProperty({ example: '2023-06-04', description: '프로젝트 시작일', required: false })
  @IsNotEmpty()
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @ApiProperty({ example: '2023-06-04', description: '프로젝트 종료일', required: false })
  @IsNotEmpty()
  @IsOptional()
  @IsDate()
  endDate?: Date;

  constructor(args?: ListResponseDto) {
    if (args) {
      this.id = args.id;
      this.title = args.title;
      this.description = args.description;
      this.purpose = args.purpose;
      this.isRecruiting = args.isRecruiting;
      this.recruitMember = args.recruitMember;
      this.members = args.members;
      this.status = args.status;
      this.period = args.period;
      this.stacks = args.stacks;
      this.bookMarkCount = args.bookMarkCount;
      this.startDate = args.startDate;
      this.endDate = args.endDate;
    }
  }
}
