import { IsArray, IsEmail, IsIn, IsNotEmpty, IsNumber, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { jobType, JobType, ProviderType, providerType } from '../domain/model';

export class CreateDto {
  @ApiProperty({ example: 'test@test.com', description: '이메일', required: true })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'asdf1234!@', description: '패스워드', required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password required at least 8' })
  password!: string;

  @ApiProperty({ example: 'nickname', description: '닉네임', required: true })
  @IsNotEmpty()
  @IsString()
  nickname!: string;

  @ApiProperty({ example: 'kakao', description: '회원가입 정보 제공자', required: true })
  @IsNotEmpty()
  @IsIn(providerType)
  provider!: ProviderType;

  @ApiProperty({ example: 3, description: '경력', required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  career!: number;

  @ApiProperty({ example: 'Developer', description: '직무', required: true })
  @IsNotEmpty()
  @IsString()
  @IsIn(jobType)
  job!: JobType;

  @ApiProperty({ example: 'I am developer', description: '자기소개', required: true })
  @IsString()
  introduction!: string;

  @ApiProperty({ example: ['node.js', 'react', 'spring'], description: '기술스택', required: true })
  @IsArray()
  @IsString({ each: true })
  stacks!: string[];

  @ApiProperty({
    example: ['https://github.com/changchanghwang'],
    description: '블로그, 깃허브 등 주소',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  urls?: string[];

  @ApiProperty({ example: 'url', description: '프로필 사진 url', required: false })
  @IsString()
  profileImage?: string;
}
