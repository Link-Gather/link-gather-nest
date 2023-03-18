import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
