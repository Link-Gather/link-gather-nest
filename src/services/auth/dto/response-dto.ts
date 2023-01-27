import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty({ example: 'test@email.com', description: '유저 email' })
  email?: string;

  @ApiProperty({ example: 'Son Heungmin', description: '유저 name' })
  name?: string;

  @ApiProperty({ example: 'example-access-token', description: 'user access token', required: false })
  accessToken?: string;

  @ApiProperty({ example: 'example-refresh-token', description: 'user refresh token', required: false })
  refreshToken?: string;
}
