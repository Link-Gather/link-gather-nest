import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test@test.com', description: '이메일' })
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty({ example: 'asdf1234!@', description: '패스워드' })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
