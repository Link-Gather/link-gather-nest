import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'title', description: '포스트 제목' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'description', description: '포스트 설명' })
  @IsNotEmpty()
  @IsString()
  description!: string;
}
