import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Injectable,
  Post,
  Query,
  Request,
  Response,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { getConfig } from '../../../config';
import { AuthGuard } from '../../../libs/auth/guard';
import { UserService } from '../application/service';
import type { JobType } from '../domain/model';
import type { CreateDto } from '../dto';

@Controller('users')
@ApiTags('User')
@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  @ApiOperation({ summary: '유저 생성', description: '유저 생성 API' })
  create(@Body() createDto: CreateDto) {
    return this.userService.create(createDto);
  }

  @Get('/profiles')
  async getProfiles(@Query('jobs') jobs: JobType[]) {
    const users = await this.userService.list({ profiles: { jobs } });
    const profiles = users.flatMap((user) => user.profiles);
    return profiles;
  }

  // eslint-disable-next-line class-methods-use-this
  @Get('/')
  @UseGuards(AuthGuard)
  async get() {
    const users = await this.userService.list({});
    return users;
  }
}
