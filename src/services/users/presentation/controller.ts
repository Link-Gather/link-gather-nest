import { Body, Controller, Get, Injectable, Post, Query } from '@nestjs/common';
import { UserService } from '../application/service';
import { CreateUserDto } from '../dto/create-user-dto';

@Controller('user')
@Injectable()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/')
  get(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }
}
