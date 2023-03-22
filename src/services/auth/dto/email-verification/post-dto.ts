import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailVerificationBodyDto {
  @ApiProperty({ example: 'test@test.com', description: 'email', required: true })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;
}
