import {
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { jobType, JobType, ProviderType, providerType } from '../../domain/model';

export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*\-_+.,?])[A-Za-z\d!@#$%^&*\-_+.,?]{8,16}$/;

export class SignUpBodyDto {
  @ApiProperty({ example: 'test@test.com', description: '이메일', required: true })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'asdf1234!@',
    description: '패스워드(8~16자리+문자+숫자+특수문자), sns 로 가입할 경우 optional',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(passwordRegex, { message: 'Passwords must contain numbers, special characters and letters.' })
  @MinLength(8, { message: 'Password required at least 8.' })
  @MaxLength(16, { message: 'Password required up to 16.' })
  @ValidateIf((o) => o.provider === 'link-gather')
  password?: string;

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
  @IsNotEmpty()
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
  @IsOptional()
  urls?: string[];

  @ApiProperty({ example: '프로필이미지1', description: '특정 프로필 이미지의 고유 값', required: true })
  @IsNotEmpty()
  @IsString()
  profileImage!: string;
}
