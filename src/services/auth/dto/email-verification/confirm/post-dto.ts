import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailVerificationConfirmBodyDto {
  @ApiProperty({ example: 'test@test.com', description: 'email', required: true })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '345983', description: 'code', required: true })
  @IsNotEmpty()
  @IsString()
  code!: string;
}
