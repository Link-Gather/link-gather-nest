import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginBodyDto {
  @ApiProperty({ example: 'test@test.com', description: '이메일', required: true })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'test@test.com', description: '이메일', required: true })
  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'example-access-token', description: 'user access token', required: true })
  accessToken!: string;

  @ApiProperty({ example: 'example-refresh-token', description: 'user refresh token', required: true })
  refreshToken!: string;
}
