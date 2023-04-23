import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { passwordRegex } from '../../../../users/dto';

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
  @IsString()
  @Matches(passwordRegex, { message: 'Password Confirm must contain numbers, special characters and letters.' })
  @MinLength(8, { message: 'Password Confirm required at least 8.' })
  @MaxLength(16, { message: 'Password Confirm required up to 16.' })
  // HACK: Equals로 하면 다른거 없애도 될 것 같은데 같을때도 에러가 나서 일단 임시로 주석처리
  // @Equals('password', { message: 'PasswordConfirm must be the same with password.' })
  passwordConfirm!: string;
}

export class PasswordChangeParamDto {
  @ApiProperty({ example: '0', description: 'verification id', required: true })
  @IsNotEmpty()
  @IsString()
  verificationId!: string;
}
