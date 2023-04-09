import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EmailVerificationBodyDto {
  @ApiProperty({ example: 'test@test.com', description: 'email', required: true })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;
}

export class EmailVerificationResponseDto {
  @ApiProperty({ example: 0, description: 'verification id', required: true })
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  constructor(args: { id: number }) {
    this.id = args.id;
  }
}
