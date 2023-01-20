import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProviderType, providerType } from '../../users/domain/model';

export class RequestParamDto {
  @ApiProperty({ example: 'Kakao', description: '회원가입 정보 제공자', required: true })
  @IsNotEmpty()
  @IsIn(providerType)
  provider!: ProviderType;
}

export class RequestBodyDto {
  @ApiProperty({ example: 'testehaGeHWfeXCBlNYpiCW2Mwcode', description: 'oauth code', required: true })
  @IsNotEmpty()
  @IsString()
  code!: string;
}
