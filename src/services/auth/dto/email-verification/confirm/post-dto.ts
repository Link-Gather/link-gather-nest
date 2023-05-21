import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmailVerificationConfirmBodyDto {
  @ApiProperty({ example: '345983', description: 'code', required: true })
  @IsNotEmpty()
  @IsString()
  code!: string;
}

export class EmailVerificationConfirmParamDto {
  @ApiProperty({ example: 'X1ctfskzB_E3hums84rTESTcF__CD', description: 'verification id', required: true })
  @IsNotEmpty()
  @IsString()
  id!: string;
}
