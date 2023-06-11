import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JobType, jobType } from '../../users/domain/model';

export class ListQueryDto {
  @ApiProperty({ example: [1, 6, 18], description: '기술스택', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stacks?: string[];

  @ApiProperty({ example: 'backendDeveloper', description: '직무', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIn(jobType)
  job?: JobType;

  @ApiProperty({ example: '1', description: '경력', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  career?: string;

  @ApiProperty({ example: '1', description: '페이지네이션용 page', default: '1', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  page?: string = '1';

  @ApiProperty({ example: '16', description: '페이지네이션용 limit', default: '8', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  limit?: string = '8';
}

export class ListResponseDto {
  @ApiProperty({ example: 'a1b2c3d4e5', description: '프로필 id', required: true })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ example: 3, description: '경력', required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  career: number;

  @ApiProperty({ example: 'frontendDeveloper', description: '직무', required: true })
  @IsNotEmpty()
  @IsString()
  @IsIn(jobType)
  job: JobType;

  @ApiProperty({ example: 'I am developer', description: '자기소개', required: true })
  @IsNotEmpty()
  @IsString()
  introduction: string;

  @ApiProperty({ example: [1, 6, 22], description: '기술스택', required: true })
  @IsArray()
  @IsNumber({}, { each: true })
  stacks: number[];

  @ApiProperty({
    example: ['https://github.com/changchanghwang'],
    description: '블로그, 깃허브 등 주소',
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  urls: string[];

  @ApiProperty({
    example: 'qg35g345',
    description: 'user id',
    required: true,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'arthur',
    description: '닉네임',
    required: true,
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    example: 'img url',
    description: '프로필 이미지',
    required: true,
  })
  @IsString()
  profileImage: string;

  constructor(args: {
    id: string;
    career: number;
    introduction: string;
    job: JobType;
    stacks: number[];
    urls: string[];
    userId: string;
    nickname: string;
    profileImage: string;
  }) {
    this.id = args.id;
    this.career = args.career;
    this.introduction = args.introduction;
    this.job = args.job;
    this.stacks = args.stacks;
    this.urls = args.urls;
    this.userId = args.userId;
    this.nickname = args.nickname;
    this.profileImage = args.profileImage;
  }
}
