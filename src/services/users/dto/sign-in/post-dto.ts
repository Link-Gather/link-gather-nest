import { IsDate, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProviderType, providerType } from '../../domain/model';

export class SignInBodyDto {
  @ApiProperty({ example: 'test@test.com', description: '이메일', required: true })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'asdf1234!@', description: '패스워드', required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password required at least 8' })
  password!: string;
}

export class SignInResponseDto {
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

  constructor(args: {
    id: string;
    email: string;
    nickname: string;
    provider: ProviderType;
    profileImage: string;
    nicknameUpdatedOn?: CalendarDate;
  }) {
    this.id = args.id;
    this.email = args.email;
    this.nickname = args.nickname;
    this.provider = args.provider;
    this.profileImage = args.profileImage;
    this.nicknameUpdatedOn = args.nicknameUpdatedOn;
  }
}
