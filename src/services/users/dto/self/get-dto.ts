import {
  IsArray,
  IsDate,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { JobType, ProviderType, jobType, providerType } from '../../domain/model';

class ProfileDto {
  @ApiProperty({ example: 'a1b2c3d4e5', description: '프로필 id', required: true })
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty({ example: 3, description: '경력', required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  career!: number;

  @ApiProperty({ example: 'frontendDeveloper', description: '직무', required: true })
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

  @ApiProperty({
    example: 'qg35g345',
    description: 'user id',
    required: true,
  })
  @IsString()
  userId!: string;
}

export class RetrieveResponseDto {
  @ApiProperty({ example: 'a1b2c3d4e5', description: '유저 id', required: true })
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty({ example: 'test@test.com', description: '이메일', required: true })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'nickname', description: '닉네임', required: true })
  @IsNotEmpty()
  @IsString()
  nickname!: string;

  @ApiProperty({ example: 'kakao', description: '회원가입 정보 제공자', required: true, enum: providerType })
  @IsNotEmpty()
  @IsIn(providerType)
  provider!: ProviderType;

  @ApiProperty({ example: 'windy', description: '유저 프로필 이미지', required: true })
  @IsNotEmpty()
  @IsString()
  profileImage!: string;

  @ApiProperty({ example: '2023-04-10', description: '닉네임 변경 일자 (3개월마다 변경 가능)' })
  @IsDate()
  @IsOptional()
  nicknameUpdatedOn?: CalendarDate;

  @ApiProperty({
    example: [
      {
        id: 'asdf12',
        stacks: [1, 3, 345, 75, 765],
        job: 'backendDeveloper',
        career: 3,
        introduction: 'I am developer',
        urls: ['https://www.naver.com'],
        userId: 'userId',
      },
    ],
    description: '유저의 프로필 목록',
  })
  @IsNotEmpty()
  @Type(() => ProfileDto)
  @ValidateNested({ each: true })
  profiles!: ProfileDto[];

  constructor(args: RetrieveResponseDto) {
    this.id = args.id;
    this.email = args.email;
    this.nickname = args.nickname;
    this.provider = args.provider;
    this.profileImage = args.profileImage;
    this.nicknameUpdatedOn = args.nicknameUpdatedOn;
    this.profiles = args.profiles;
  }
}
