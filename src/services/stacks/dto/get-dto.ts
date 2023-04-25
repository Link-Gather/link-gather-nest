import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ListResponseDto {
  @ApiProperty({ example: 1, description: '기술스택 id', required: true })
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @ApiProperty({ example: 'node.js', description: '기술스택 명칭', required: true })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 3, description: '기술스택 이름 길이', required: true })
  @IsNumber()
  @IsNotEmpty()
  length!: number;

  constructor(args: { id: number; name: string; length: number }) {
    this.id = args.id;
    this.name = args.name;
    this.length = args.length;
  }
}
