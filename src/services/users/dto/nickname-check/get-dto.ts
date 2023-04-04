import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class NicknameCheckQueryDto {
  @ApiProperty({ example: 'windy', description: '사용자 닉네임', required: true })
  @IsString()
  @IsNotEmpty()
  nickname!: string;
}

export class NicknameCheckResponseDto {
  @ApiProperty({ example: 'false', description: '닉네임 중복 여부', required: true })
  @IsBoolean()
  isDuplicated!: boolean;

  constructor(args: { isDuplicated: boolean }) {
    this.isDuplicated = args.isDuplicated;
  }
}
