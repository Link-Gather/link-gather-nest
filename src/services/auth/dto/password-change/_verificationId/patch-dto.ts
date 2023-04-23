import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordChangeBodyDto {
  @ApiProperty({ example: '345983', description: 'code', required: true })
  @IsNotEmpty()
  @IsString()
  password!: string;

  @ApiProperty({ example: '345983', description: 'code', required: true })
  @IsNotEmpty()
  @IsString()
  passwordConfirm!: string;
}

export class PasswordChangeParamDto {
  @ApiProperty({ example: '0', description: 'verification id', required: true })
  @IsNotEmpty()
  @IsString()
  verificationId!: string;
}
