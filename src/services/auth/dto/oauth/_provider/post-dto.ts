import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProviderType, providerType } from '../../../../users/domain/model';

export class OauthParamDto {
  @ApiProperty({ example: 'kakao', description: '회원가입 정보 제공자', required: true })
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
  email?: string;

  @ApiProperty({ example: 'Son Heungmin', description: '유저 nickname' })
  nickname?: string;

  @ApiProperty({ example: 'kakao', description: '회원가입 정보 제공자', required: true })
  @IsNotEmpty()
  @IsIn(providerType)
  provider!: ProviderType;

  @ApiProperty({ example: 'example-access-token', description: 'user access token', required: false })
  accessToken?: string;

  @ApiProperty({ example: 'example-refresh-token', description: 'user refresh token', required: false })
  refreshToken?: string;
}
