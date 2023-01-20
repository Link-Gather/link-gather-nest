import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty({ example: 'testehaGeHWfeXCBlNYpiCW2Mwcode', description: 'oauth code', required: false })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  email?: string;

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
}
