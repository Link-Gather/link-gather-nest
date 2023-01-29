import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestParamDto {
  @ApiProperty({ example: 'kakao', description: '회원가입 정보 제공자', required: true })
  @IsIn(['kakao', 'github', 'google'])
  provider!: 'kakao' | 'github' | 'google';
}

export class RequestBodyDto {
  @ApiProperty({ example: 'testehaGeHWfeXCBlNYpiCW2Mwcode', description: 'oauth code', required: true })
  @IsNotEmpty()
  @IsString()
  code!: string;
}
