import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { type VerificationType, verificationType } from '../../../verifications/domain/model';

export class EmailVerificationBodyDto {
  @ApiProperty({ example: 'test@test.com', description: 'email', required: true })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'signup', description: '인증 타입', required: true })
  @IsNotEmpty()
  @IsIn(verificationType)
  @IsString()
  type!: VerificationType;
}

export class EmailVerificationResponseDto {
  @ApiProperty({ example: 'nanoid', description: 'verification id', required: true })
  @IsNotEmpty()
  @IsString()
  id!: string;

  constructor(args: { id: string }) {
    this.id = args.id;
  }
}
