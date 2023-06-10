import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProviderType, providerType } from '../../../../users/domain/model';

export class OauthParamDto {
  @ApiProperty({
    example: 'kakao',
    description: '회원가입 정보 제공자',
    required: true,
    enum: ['kakao', 'github', 'google'],
  })
  @IsIn(['kakao', 'github', 'google'])
  provider!: 'kakao' | 'github' | 'google';
}

export class OauthBodyDto {
  @ApiProperty({ example: 'testehaGeHWfeXCBlNYpiCW2Mwcode', description: 'oauth code', required: true })
  @IsNotEmpty()
  @IsString()
  code!: string;
}

export class OauthResponseDto {
  @ApiProperty({ example: 'test@email.com', description: '유저 email' })
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Son Heungmin', description: '유저 nickname' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({ example: 'kakao', description: '회원가입 정보 제공자', required: true, enum: providerType })
  @IsNotEmpty()
  @IsIn(providerType)
  provider!: ProviderType;

  @ApiProperty({ example: 'example-access-token', description: 'user access token', required: false })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  accessToken?: string;

  @ApiProperty({ example: 'example-refresh-token', description: 'user refresh token', required: false })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  refreshToken?: string;

  constructor(args: {
    email?: string;
    nickname?: string;
    provider: ProviderType;
    accessToken?: string;
    refreshToken?: string;
  }) {
    this.email = args.email;
    this.nickname = args.nickname;
    this.provider = args.provider;
    this.accessToken = args.accessToken;
    this.refreshToken = args.refreshToken;
  }
}
