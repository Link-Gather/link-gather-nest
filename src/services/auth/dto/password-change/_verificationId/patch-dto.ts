import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Match } from '@libs/class-validator';
import { passwordRegex } from '../../../../regex';

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
  @ApiProperty({ example: 'X1ctfskzB_E3hums84rTESTcF__CD', description: 'verification id', required: true })
  @IsNotEmpty()
  @IsString()
  verificationId!: string;
}
