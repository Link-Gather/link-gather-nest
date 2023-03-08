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
