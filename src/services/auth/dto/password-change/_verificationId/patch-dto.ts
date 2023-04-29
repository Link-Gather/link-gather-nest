import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { passwordRegex } from '../../../../regex';
import { Match } from '../../../../../libs/class-validator';

export class PasswordChangeBodyDto {
  @ApiProperty({ example: 'asdf1234!@', description: '패스워드(8~16자리+문자+숫자+특수문자)' })
  @IsNotEmpty()
  @IsString()
  @Matches(passwordRegex, { message: 'Password must contain numbers, special characters and letters.' })
  @MinLength(8, { message: 'Password required at least 8.' })
  @MaxLength(16, { message: 'Password required up to 16.' })
  password!: string;

  @ApiProperty({ example: 'asdf1234!@', description: '패스워드 확인' })
  @IsNotEmpty()
  @Match('password', { message: 'Password Confirm must match with password.' })
  passwordConfirm!: string;
}

export class PasswordChangeParamDto {
  @ApiProperty({ example: '0', description: 'verification id', required: true })
  @IsNotEmpty()
  @IsString()
  verificationId!: string;
}
