import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Injectable,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from '../application/service';
import type { JobType } from '../domain/model';
import type { CreateUserDto } from '../dto/create-user-dto';

@Controller('users')
@ApiTags('User')
@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  @ApiOperation({ summary: '유저 생성', description: '유저 생성 API' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/profiles')
  async getProfiles(@Query('jobs') jobs: JobType[]) {
    const users = await this.userService.list({ profiles: { jobs } });
    const profiles = users.flatMap((user) => user.profiles);
    return profiles;
  }
}
