import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostRequestParamDto {
  @ApiProperty({ example: 'kakao', description: '회원가입 정보 제공자', required: true })
  @IsIn(['kakao', 'github', 'google'])
  provider!: 'kakao' | 'github' | 'google';
}

export class PostRequestBodyDto {
  @ApiProperty({ example: 'testehaGeHWfeXCBlNYpiCW2Mwcode', description: 'oauth code', required: true })
  @IsNotEmpty()
  @IsString()
  code!: string;
}

export class PostResponseDto {
  @ApiProperty({ example: 'test@email.com', description: '유저 email' })
  email?: string;

  @ApiProperty({ example: 'Son Heungmin', description: '유저 nickname' })
  nickname?: string;

  @ApiProperty({ example: 'example-access-token', description: 'user access token', required: false })
  accessToken?: string;

  @ApiProperty({ example: 'example-refresh-token', description: 'user refresh token', required: false })
  refreshToken?: string;
}
