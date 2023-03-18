import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class nicknameCheckQueryDto {
  @ApiProperty({ example: 'windy', description: '사용자 닉네임', required: true })
  @IsString()
  @IsNotEmpty()
  nickname!: string;
}
