import { Body, Controller, Get, Injectable, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from '../application/service';
import { CreateUserDto } from '../dto/create-user-dto';

@Controller('users')
@ApiTags('User')
@Injectable()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  @ApiOperation({ summary: '유저 생성', description: '유저 생성 API' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/')
  @ApiOperation({ summary: '유저 조회', description: '유저 조회 API' })
  get(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get('/profiles')
  getProfiles() {
    return this.userService.findProfiles();
  }
}
